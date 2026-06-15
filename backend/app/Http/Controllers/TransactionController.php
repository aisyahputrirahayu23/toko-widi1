<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $transactions = Transaction::with(['user', 'items.product'])
            ->latest()
            ->get();

        return response()->json($transactions);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'payment_method'     => 'required|in:tunai,qris,kartu',
            'note'               => 'nullable|string|max:500',
            'items'              => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1|max:9999',
        ], [
            'payment_method.required' => 'Metode pembayaran wajib dipilih.',
            'payment_method.in'       => 'Metode pembayaran tidak valid. Pilih tunai, qris, atau kartu.',
            'note.max'                => 'Catatan maksimal 500 karakter.',
            'items.required'          => 'Minimal satu produk harus dipilih.',
            'items.min'               => 'Minimal satu produk harus dipilih.',
            'items.*.product_id.required' => 'Produk wajib dipilih.',
            'items.*.product_id.exists'   => 'Produk tidak ditemukan.',
            'items.*.quantity.required'   => 'Jumlah produk wajib diisi.',
            'items.*.quantity.integer'    => 'Jumlah harus berupa angka bulat.',
            'items.*.quantity.min'        => 'Jumlah minimal 1.',
            'items.*.quantity.max'        => 'Jumlah terlalu besar.',
        ]);

        DB::beginTransaction();

        try {
            $totalPrice = 0;
            $itemsToInsert = [];

            foreach ($data['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    DB::rollBack();
                    return response()->json([
                        'message' => "Stok produk '{$product->name}' tidak cukup (stok: {$product->stock})",
                    ], 422);
                }

                $subtotal = $product->price * $item['quantity'];
                $totalPrice += $subtotal;

                $itemsToInsert[] = [
                    'product'  => $product,
                    'quantity' => $item['quantity'],
                    'price'    => $product->price,
                ];
            }

            $transaction = Transaction::create([
                'user_id'        => $request->user('api')->id,
                'payment_method' => $data['payment_method'],
                'total_price'    => $totalPrice,
                'note'           => $data['note'] ?? null,
            ]);

            foreach ($itemsToInsert as $item) {
                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'product_id'     => $item['product']->id,
                    'quantity'       => $item['quantity'],
                    'price_per_unit' => $item['price'],
                ]);

                $item['product']->decrement('stock', $item['quantity']);
            }

            DB::commit();

            return response()->json($transaction->load('items.product'), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Transaksi gagal'], 500);
        }
    }

    public function show(Transaction $transaction)
    {
        return response()->json($transaction->load(['user', 'items.product']));
    }
}

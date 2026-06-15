<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::with('supplier')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'supplier_id'  => 'required|exists:suppliers,id',
            'name'         => 'required|string|max:255|unique:products,name',
            'price'        => 'required|integer|min:0|max:99999999',
            'stock'        => 'required|integer|min:0|max:99999',
            'expired_date' => 'nullable|date|after:today',
        ], [
            'supplier_id.required'  => 'Supplier wajib dipilih.',
            'supplier_id.exists'    => 'Supplier tidak ditemukan.',
            'name.required'         => 'Nama produk wajib diisi.',
            'name.max'              => 'Nama produk maksimal 255 karakter.',
            'name.unique'           => 'Nama produk sudah terdaftar.',
            'price.required'        => 'Harga wajib diisi.',
            'price.integer'         => 'Harga harus berupa angka.',
            'price.min'             => 'Harga tidak boleh negatif.',
            'price.max'             => 'Harga terlalu besar.',
            'stock.required'        => 'Stok wajib diisi.',
            'stock.integer'         => 'Stok harus berupa angka bulat.',
            'stock.min'             => 'Stok tidak boleh negatif.',
            'stock.max'             => 'Stok terlalu besar.',
            'expired_date.date'     => 'Format tanggal expired tidak valid.',
            'expired_date.after'    => 'Tanggal expired harus setelah hari ini.',
        ]);

        $product = Product::create($data);

        return response()->json($product->load('supplier'), 201);
    }

    public function show(Product $product)
    {
        return response()->json($product->load('supplier'));
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'supplier_id'  => 'sometimes|exists:suppliers,id',
            'name'         => "sometimes|string|max:255|unique:products,name,{$product->id}",
            'price'        => 'sometimes|integer|min:0|max:99999999',
            'stock'        => 'sometimes|integer|min:0|max:99999',
            'expired_date' => 'nullable|date|after:today',
        ], [
            'supplier_id.exists'    => 'Supplier tidak ditemukan.',
            'name.max'              => 'Nama produk maksimal 255 karakter.',
            'name.unique'           => 'Nama produk sudah digunakan produk lain.',
            'price.integer'         => 'Harga harus berupa angka.',
            'price.min'             => 'Harga tidak boleh negatif.',
            'price.max'             => 'Harga terlalu besar.',
            'stock.integer'         => 'Stok harus berupa angka bulat.',
            'stock.min'             => 'Stok tidak boleh negatif.',
            'stock.max'             => 'Stok terlalu besar.',
            'expired_date.date'     => 'Format tanggal expired tidak valid.',
            'expired_date.after'    => 'Tanggal expired harus setelah hari ini.',
        ]);

        $product->update($data);

        return response()->json($product->load('supplier'));
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Produk berhasil dihapus']);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $from = $request->query('from');
        $to   = $request->query('to');

        $query = Transaction::with(['user', 'items.product'])->latest();

        if ($from) {
            $query->whereDate('created_at', '>=', $from);
        }
        if ($to) {
            $query->whereDate('created_at', '<=', $to);
        }

        $transactions = $query->get();

        $totalPendapatan = $transactions->sum('total_price');
        $jumlahTransaksi = $transactions->count();
        $rataRataTransaksi = $jumlahTransaksi > 0 ? round($totalPendapatan / $jumlahTransaksi) : 0;

        $produkTerlaris = TransactionItem::with('product')
            ->selectRaw('product_id, SUM(quantity) as total_qty, SUM(quantity * price_per_unit) as total_revenue')
            ->groupBy('product_id')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get();

        $perHari = Transaction::selectRaw('DATE(created_at) as tanggal, SUM(total_price) as total')
            ->when($from, fn($q) => $q->whereDate('created_at', '>=', $from))
            ->when($to, fn($q) => $q->whereDate('created_at', '<=', $to))
            ->groupBy('tanggal')
            ->orderBy('tanggal')
            ->get();

        return response()->json([
            'total_pendapatan'      => $totalPendapatan,
            'jumlah_transaksi'      => $jumlahTransaksi,
            'rata_rata_transaksi'   => $rataRataTransaksi,
            'produk_terlaris'       => $produkTerlaris, 
            'grafik_per_hari'       => $perHari,
            'transaksi'             => $transactions,
        ]);
    }
}

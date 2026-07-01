import { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "../components/PageHeader";

const API = "http://localhost:8000/api";
const PER_PAGE = 3;

const PAYMENT_LABELS = { tunai: "Tunai", qris: "QRIS", kartu: "Kartu" };

function Pagination({ page, total, onChange }) {
  const totalPages = Math.ceil(total / PER_PAGE);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-end gap-1 mt-4">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ‹
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1 rounded-lg text-sm border ${
            p === page
              ? "bg-[#8B4513] text-white border-[#8B4513]"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ›
      </button>
    </div>
  );
}

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [produkPage, setProdukPage] = useState(1);
  const [transaksiPage, setTransaksiPage] = useState(1);

  const fetchReport = async () => {
    setLoading(true);
    setProdukPage(1);
    setTransaksiPage(1);
    try {
      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;
      const res = await axios.get(`${API}/reports`, { params });
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(); }, []);

  const maxTotal = data?.grafik_per_hari?.length
    ? Math.max(...data.grafik_per_hari.map(d => d.total))
    : 1;

  return (
    <div className="space-y-6">
      <PageHeader />

      {/* Filter */}
      <div className="px-6">
        <div className="bg-white rounded-2xl p-5 flex flex-wrap gap-4 items-end shadow-sm">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Dari Tanggal</label>
            <input
              type="date"
              value={from}
              onChange={e => setFrom(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Sampai Tanggal</label>
            <input
              type="date"
              value={to}
              onChange={e => setTo(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>
          <button
            onClick={fetchReport}
            className="bg-[#8B4513] hover:bg-[#6f360d] text-white px-5 py-2 rounded-xl text-sm font-medium"
          >
            Filter
          </button>
          {(from || to) && (
            <button
              onClick={() => { setFrom(""); setTo(""); setTimeout(fetchReport, 0); }}
              className="border border-gray-300 text-gray-600 px-5 py-2 rounded-xl text-sm hover:bg-gray-50"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="px-6 text-gray-400 text-sm">Memuat laporan...</p>
      ) : (
        <>
          {/* Statistik Ringkasan */}
          <div className="px-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Total Pendapatan</p>
              <p className="text-2xl font-bold text-[#8B4513]">
                Rp {Number(data?.total_pendapatan ?? 0).toLocaleString("id-ID")}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Jumlah Transaksi</p>
              <p className="text-2xl font-bold text-gray-800">{data?.jumlah_transaksi ?? 0}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Rata-rata per Transaksi</p>
              <p className="text-2xl font-bold text-gray-800">
                Rp {Number(data?.rata_rata_transaksi ?? 0).toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* Grafik Penjualan per Hari */}
          <div className="px-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Grafik Penjualan per Hari</h3>
              {data?.grafik_per_hari?.length ? (
                <div className="flex items-end gap-2 h-48 overflow-x-auto pb-2 pt-6">
                  {data.grafik_per_hari.map((d) => (
                    <div key={d.tanggal} className="flex flex-col items-center gap-1 min-w-[48px]">
                      <span className="text-xs text-gray-500">
                        Rp {Number(d.total).toLocaleString("id-ID", { notation: "compact" })}
                      </span>
                      <div
                        className="w-10 bg-[#8B4513] rounded-t-md"
                        style={{ height: `${Math.max(4, (d.total / maxTotal) * 120)}px` }}
                      />
                      <span className="text-xs text-gray-400">
                        {new Date(d.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">Belum ada data grafik.</p>
              )}
            </div>
          </div>

          {/* Produk Terlaris */}
          <div className="px-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Produk Terlaris</h3>
              {data?.produk_terlaris?.length ? (
                <>
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="pb-2 text-left text-xs font-medium text-gray-400">Produk</th>
                        <th className="pb-2 text-left text-xs font-medium text-gray-400">Total Terjual</th>
                        <th className="pb-2 text-left text-xs font-medium text-gray-400">Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {data.produk_terlaris.slice((produkPage - 1) * PER_PAGE, produkPage * PER_PAGE).map((p) => (
                        <tr key={p.product_id}>
                          <td className="py-3 text-sm text-gray-700">{p.product?.name ?? `Produk #${p.product_id}`}</td>
                          <td className="py-3 text-sm text-gray-700">{p.total_qty} pcs</td>
                          <td className="py-3 text-sm text-gray-700">Rp {Number(p.total_revenue).toLocaleString("id-ID")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Pagination page={produkPage} total={data.produk_terlaris.length} onChange={setProdukPage} />
                </>
              ) : (
                <p className="text-sm text-gray-400">Belum ada data produk terlaris.</p>
              )}
            </div>
          </div>

          {/* List Semua Transaksi */}
          <div className="px-6 pb-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Semua Transaksi</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-2 text-left text-xs font-medium text-gray-400">Tanggal</th>
                      <th className="pb-2 text-left text-xs font-medium text-gray-400">Karyawan</th>
                      <th className="pb-2 text-left text-xs font-medium text-gray-400">Produk</th>
                      <th className="pb-2 text-left text-xs font-medium text-gray-400">Total</th>
                      <th className="pb-2 text-left text-xs font-medium text-gray-400">Pembayaran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data?.transaksi?.slice((transaksiPage - 1) * PER_PAGE, transaksiPage * PER_PAGE).map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50">
                        <td className="py-3 text-sm text-gray-700">
                          {new Date(tx.created_at).toLocaleDateString("id-ID")}
                        </td>
                        <td className="py-3 text-sm text-gray-700">{tx.user?.name ?? "-"}</td>
                        <td className="py-3 text-sm text-gray-700">
                          {tx.items?.map(i => `${i.product?.name} (${i.quantity})`).join(", ") ?? "-"}
                        </td>
                        <td className="py-3 text-sm font-medium text-gray-800">
                          Rp {Number(tx.total_price).toLocaleString("id-ID")}
                        </td>
                        <td className="py-3 text-sm">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700">
                            {PAYMENT_LABELS[tx.payment_method] ?? tx.payment_method}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {!data?.transaksi?.length && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-400 text-sm">
                          Belum ada transaksi.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination page={transaksiPage} total={data?.transaksi?.length ?? 0} onChange={setTransaksiPage} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

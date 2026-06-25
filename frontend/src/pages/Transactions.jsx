import { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import { useToast } from "../context/ToastContext";

const API = "http://localhost:8000/api";
const PER_PAGE = 10;

const PAYMENT_LABELS = { tunai: "Tunai", qris: "QRIS", kartu: "Kartu" };

export default function Transactions() {
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);

  const [paymentMethod, setPaymentMethod] = useState("tunai");
  const [note, setNote] = useState("");
  const [items, setItems] = useState([{ product_id: "", quantity: 1 }]);
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    try {
      const [txRes, prodRes] = await Promise.all([
        axios.get(`${API}/transactions`),
        axios.get(`${API}/products`),
      ]);
      setTransactions(txRes.data);
      setProducts(prodRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const addItem = () => setItems([...items, { product_id: "", quantity: 1 }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, value) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    setItems(updated);
  };

  const getProduct = (id) => products.find(p => String(p.id) === String(id));

  const totalHarga = items.reduce((sum, item) => {
    const p = getProduct(item.product_id);
    return sum + (p ? p.price * (parseInt(item.quantity) || 0) : 0);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/transactions`, {
        payment_method: paymentMethod,
        note,
        items: items.map(i => ({ product_id: i.product_id, quantity: parseInt(i.quantity) })),
      });
      setShowModal(false);
      setItems([{ product_id: "", quantity: 1 }]);
      setNote("");
      setPaymentMethod("tunai");
      showToast("Transaksi berhasil dibuat");
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.message || "Transaksi gagal, periksa data kembali.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (method) => {
    const colors = { tunai: "bg-green-100 text-green-700", qris: "bg-blue-100 text-blue-700", kartu: "bg-purple-100 text-purple-700" };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[method] ?? "bg-gray-100 text-gray-600"}`}>
        {PAYMENT_LABELS[method] ?? method}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader />

      <div className="p-6 bg-white space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Riwayat Transaksi</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-orange-700 hover:bg-orange-950 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            + Buat Transaksi
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm">Memuat data...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">#</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tanggal</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Produk</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Pembayaran</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Karyawan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-500">#{tx.id}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {new Date(tx.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {tx.items?.map(i => `${i.product?.name} (${i.quantity})`).join(", ") ?? "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 font-medium">
                      Rp {Number(tx.total_price).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-4 text-sm">{statusBadge(tx.payment_method)}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{tx.user?.name ?? "-"}</td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">
                      Belum ada transaksi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination page={page} total={transactions.length} perPage={PER_PAGE} onChange={setPage} />
          </div>
        )}
      </div>

      {/* Modal Buat Transaksi */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Buat Transaksi Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Items */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Produk</label>
                  <button type="button" onClick={addItem} className="text-xs text-orange-700 hover:underline">
                    + Tambah Produk
                  </button>
                </div>
                <div className="space-y-3">
                  {items.map((item, i) => {
                    const p = getProduct(item.product_id);
                    return (
                      <div key={i} className="flex gap-2 items-center">
                        <select
                          value={item.product_id}
                          onChange={e => updateItem(i, "product_id", e.target.value)}
                          className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                          required
                        >
                          <option value="">Pilih produk</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} — Rp {Number(p.price).toLocaleString("id-ID")} (stok: {p.stock})
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={e => updateItem(i, "quantity", e.target.value)}
                          className="w-20 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                          min="1"
                          max={p?.stock ?? 999}
                          required
                        />
                        {items.length > 1 && (
                          <button type="button" onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total preview */}
              <div className="bg-orange-50 rounded-xl px-4 py-3 flex justify-between items-center">
                <span className="text-sm text-gray-600">Total</span>
                <span className="font-bold text-[#8B4513]">Rp {totalHarga.toLocaleString("id-ID")}</span>
              </div>

              {/* Metode Pembayaran */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</label>
                <div className="flex gap-3">
                  {["tunai", "qris", "kartu"].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                        paymentMethod === m
                          ? "bg-[#8B4513] text-white border-[#8B4513]"
                          : "border-gray-300 text-gray-600 hover:border-[#8B4513]"
                      }`}
                    >
                      {PAYMENT_LABELS[m]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (opsional)</label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#8B4513] hover:bg-[#6f360d] disabled:opacity-60 text-white py-2 rounded-xl text-sm font-medium"
                >
                  {submitting ? "Memproses..." : "Bayar"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl text-sm font-medium hover:bg-gray-50"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

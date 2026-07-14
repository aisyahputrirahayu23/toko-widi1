import { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import ConfirmModal from "../components/ConfirmModal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const API = "http://localhost:8000/api";
const PER_PAGE = 10;

function getExpiryStatus(expiredDate) {
  if (!expiredDate) return null;
  const today = new Date(new Date().toDateString());
  const expiry = new Date(expiredDate);
  const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "expired";
  if (diffDays <= 7) return "soon";
  return "ok";
}

export default function Product() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isKaryawan = user?.role === "karyawan";

  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({ supplier_id: "", name: "", price: "", stock: "", expired_date: "" });
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [expiredOnly, setExpiredOnly] = useState(false);
  const [soonOnly, setSoonOnly] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const endpoint = isKaryawan ? `${API}/products` : `${API}/inventory`;

  const fetchProducts = async () => {
    try {
      const res = await axios.get(endpoint);
      setProducts(res.data);
    } catch {
      setError("Gagal memuat produk.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    if (isKaryawan) {
      axios.get(`${API}/suppliers`).then(res => setSuppliers(res.data));
    }
  }, []);

  const openAdd = () => {
    setEditTarget(null);
    setForm({ supplier_id: "", name: "", price: "", stock: "", expired_date: "" });
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditTarget(product);
    setForm({
      supplier_id: product.supplier_id ?? "",
      name: product.name,
      price: product.price,
      stock: product.stock,
      expired_date: product.expired_date ?? "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTarget) {
        await axios.put(`${API}/products/${editTarget.id}`, form);
        showToast("Produk berhasil diperbarui");
      } else {
        await axios.post(`${API}/products`, form);
        showToast("Produk berhasil ditambahkan");
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(" ")
        : err.response?.data?.message || "Gagal menyimpan produk.";
      showToast(msg, "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${API}/products/${deleteTarget.id}`);
      showToast("Produk berhasil dihapus");
      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal menghapus produk.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredProducts = products.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const status = getExpiryStatus(item.expired_date);
    if (expiredOnly) return matchesSearch && status === "expired";
    if (soonOnly) return matchesSearch && status === "soon";
    return matchesSearch;
  });

  return (
    <div className="space-y-1 p-6">
      <PageHeader />

      <div className="bg-white rounded-2xl shadow-sm border border-base-200 p-6 space-y-6">

        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Cari berdasarkan nama produk..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30"
          />
          <button
            type="button"
            onClick={() => { setExpiredOnly(v => !v); setSoonOnly(false); setPage(1); }}
            className={
              expiredOnly
                ? "px-4 py-2.5 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                : "px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50"
            }
          >
            ⚠ Produk Expired
          </button>
          <button
            type="button"
            onClick={() => { setSoonOnly(v => !v); setExpiredOnly(false); setPage(1); }}
            className={
              soonOnly
                ? "px-4 py-2.5 rounded-xl text-sm font-medium bg-yellow-500 text-white hover:bg-yellow-600"
                : "px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50"
            }
          >
            ⏳ Segera Expired (7 Hari)
          </button>

          {isKaryawan && (
          <button
            onClick={openAdd}
            className="bg-orange-700 hover:bg-orange-950 text-white px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap"
          >
            + Add Product
          </button>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {loading ? (
          <p className="text-gray-400 text-sm">Memuat data...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Produk</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Harga</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Supplier</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Stok</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Expired</th>
                  {isKaryawan && (
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-400">Aksi</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((item) => {
                  const status = getExpiryStatus(item.expired_date);
                  const rowClass =
                    status === "expired" ? "bg-red-50 hover:bg-red-100"
                    : status === "soon" ? "bg-yellow-50 hover:bg-yellow-100"
                    : "hover:bg-gray-50";
                  return (
                  <tr key={item.id} className={rowClass}>
                    <td className="px-4 py-4 text-sm text-gray-700">{item.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">Rp {Number(item.price).toLocaleString("id-ID")}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{item.supplier?.name ?? "-"}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={
                        item.stock === 0
                          ? "px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"
                          : item.stock <= 5
                          ? "px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700"
                          : "text-gray-700"
                      }>
                        {item.stock === 0 ? "Habis" : item.stock}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {item.expired_date ? (
                        <span className={
                          status === "expired" ? "px-2 py-1 rounded-full text-xs font-semibold bg-red-200 text-red-800"
                          : status === "soon" ? "px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800"
                          : "text-gray-700"
                        }>
                          {item.expired_date}
                          {status === "expired" && " ⚠ Expired"}
                          {status === "soon" && " ⚠ Segera Expired"}
                        </span>
                      ) : "-"}
                    </td>
                    {isKaryawan && (
                      <td className="px-4 py-4 text-sm text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => openEdit(item)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={isKaryawan ? 6 : 5} className="px-4 py-8 text-center text-gray-400 text-sm">
                      {search
                        ? `Produk "${search}" tidak ditemukan.`
                        : expiredOnly
                        ? "Tidak ada produk yang expired."
                        : soonOnly
                        ? "Tidak ada produk yang segera expired."
                        : "Belum ada produk."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination page={page} total={filteredProducts.length} perPage={PER_PAGE} onChange={setPage} />
          </div>
        )}
      </div>

      {/* Modal Add/Edit (karyawan only) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-6">
              {editTarget ? "Edit Produk" : "Tambah Produk"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <select
                  value={form.supplier_id}
                  onChange={e => setForm({ ...form, supplier_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  required
                >
                  <option value="">Pilih supplier</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Expired</label>
                <input
                  type="date"
                  value={form.expired_date}
                  onChange={e => setForm({ ...form, expired_date: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#8B4513] hover:bg-[#6f360d] text-white py-2 rounded-xl text-sm font-medium"
                >
                  Simpan
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

      <ConfirmModal
        isOpen={!!deleteTarget}
        message={`Yakin hapus produk "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

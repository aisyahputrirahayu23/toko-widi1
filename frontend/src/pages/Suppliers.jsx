import { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import { useToast } from "../context/ToastContext";

const API = "http://localhost:8000/api";
const PER_PAGE = 10;
const emptyForm = { name: "", phone: "" };

export default function Suppliers() {
  const { showToast } = useToast();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${API}/suppliers`);
      setSuppliers(res.data);
    } catch {
      setError("Gagal memuat data supplier.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditTarget(s);
    setForm({ name: s.name, phone: s.phone ?? "" });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (editTarget) {
        await axios.put(`${API}/suppliers/${editTarget.id}`, form);
        showToast("Supplier berhasil diperbarui");
      } else {
        await axios.post(`${API}/suppliers`, form);
        showToast("Supplier berhasil ditambahkan");
      }
      setShowModal(false);
      fetchSuppliers();
    } catch (err) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(" ")
        : err.response?.data?.message || "Gagal menyimpan supplier.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (s) => {
    if (!confirm(`Yakin hapus supplier "${s.name}"?`)) return;
    try {
      await axios.delete(`${API}/suppliers/${s.id}`);
      showToast("Supplier berhasil dihapus");
      fetchSuppliers();
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal menghapus supplier.", "error");
    }
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader />

      <div className="p-6 bg-white space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Supplier</h2>
          <button
            onClick={openAdd}
            className="bg-orange-700 hover:bg-orange-950 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            + Tambah Supplier
          </button>
        </div>

        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30"
        />

        {error && !showModal && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {loading ? (
          <p className="text-gray-400 text-sm">Memuat data...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">

                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nama Supplier</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">No. Telepon</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Jumlah Produk</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSuppliers.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    
                    <td className="px-4 py-4 text-sm text-gray-800 font-medium">{s.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{s.phone ?? "-"}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {s.products_count} produk
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEdit(s)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredSuppliers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">
                      {search ? `Supplier "${search}" tidak ditemukan.` : "Belum ada supplier."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination page={page} total={filteredSuppliers.length} perPage={PER_PAGE} onChange={setPage} />
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-6">
              {editTarget ? "Edit Supplier" : "Tambah Supplier Baru"}
            </h3>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Supplier</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No. Telepon <span className="text-gray-400 font-normal">(opsional)</span>
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#8B4513] hover:bg-[#6f360d] disabled:opacity-60 text-white py-2 rounded-xl text-sm font-medium"
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
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

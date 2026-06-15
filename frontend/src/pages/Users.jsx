import { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:8000/api";

const ROLE_LABELS = { admin: "Admin", karyawan: "Karyawan" };
const ROLE_BADGE = {
  admin:    "bg-purple-100 text-purple-700",
  karyawan: "bg-blue-100 text-blue-700",
};

const emptyForm = { name: "", email: "", password: "", role: "karyawan" };

export default function Users() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/users`);
      setUsers(res.data);
    } catch {
      setError("Gagal memuat data user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditTarget(u);
    setForm({ name: u.name, email: u.email, password: "", role: u.role });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = { ...form };
      if (editTarget && !payload.password) delete payload.password;

      if (editTarget) {
        await axios.put(`${API}/users/${editTarget.id}`, payload);
      } else {
        await axios.post(`${API}/users`, payload);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(" ")
        : err.response?.data?.message || "Gagal menyimpan user.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (u) => {
    if (!confirm(`Yakin hapus user "${u.name}"?`)) return;
    try {
      await axios.delete(`${API}/users/${u.id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus user.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader />

      <div className="p-6 bg-white space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Kelola User</h2>
          <button
            onClick={openAdd}
            className="bg-orange-700 hover:bg-orange-950 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            + Tambah User
          </button>
        </div>

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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">#</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nama</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Terdaftar</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-400">{u.id}</td>
                    <td className="px-4 py-4 text-sm text-gray-800 font-medium">
                      {u.name}
                      {u.id === me?.id && (
                        <span className="ml-2 text-xs text-gray-400">(Anda)</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{u.email}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ROLE_BADGE[u.role]}`}>
                        {ROLE_LABELS[u.role]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(u.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 py-4 text-sm text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEdit(u)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          disabled={u.id === me?.id}
                          className="bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-xs font-medium"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">
                      Belum ada user.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-6">
              {editTarget ? "Edit User" : "Tambah User Baru"}
            </h3>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {editTarget && <span className="text-gray-400 font-normal">(kosongkan jika tidak diubah)</span>}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  required={!editTarget}
                  placeholder={editTarget ? "••••••" : ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                  <option value="karyawan">Karyawan</option>
                  <option value="admin">Admin</option>
                </select>
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

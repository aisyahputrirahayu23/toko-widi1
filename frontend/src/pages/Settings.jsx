import { useState, useRef } from "react";
import {
  MdOutlinePerson,
  MdOutlineLock,
  MdOutlineStore,
  MdOutlineNotifications,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
  MdOutlineCheckCircle,
  MdOutlineCameraAlt,
} from "react-icons/md";
import PageHeader from "../components/PageHeader";
import ConfirmModal from "../components/ConfirmModal";
import { useAuth } from "../context/AuthContext";

function SectionCard({ icon, title, children }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-[#f5ede6] flex items-center justify-center text-xl text-[#8B4513]">
          {icon}
        </div>
        <h2 className="text-lg font-bold text-[#3E2C1C]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function InputField({ label, type = "text", value, onChange, placeholder, disabled }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all duration-200 outline-none
          ${disabled
            ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
            : "bg-white border-gray-200 text-[#3E2C1C] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10"
          }`}
      />
    </div>
  );
}

function SaveButton({ onClick, saved }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = () => {
    setShowConfirm(false);
    onClick();
  };

  return (
    <>
      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={() => setShowConfirm(true)}
          className="px-6 py-2.5 bg-[#8B4513] hover:bg-[#7a3c10] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Simpan Perubahan
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
            <MdOutlineCheckCircle className="text-lg" />
            Tersimpan!
          </span>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        message="Yakin simpan perubahan?"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}

// ─── PROFIL AKUN ────────────────────────────────────────────────────────────
function ProfilSection({ user }) {
  const { foto, setFotoUser } = useAuth();
  const [nama, setNama] = useState(user?.name ?? "");
  const [pendingFoto, setPendingFoto] = useState(null);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPendingFoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (pendingFoto) {
      setFotoUser(pendingFoto);
      setPendingFoto(null);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const displayFoto = pendingFoto ?? foto;

  return (
    <SectionCard icon={<MdOutlinePerson />} title="Profil Akun">
      <div className="flex items-center gap-6 mb-6">
        {/* Avatar + tombol ganti foto */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-[#8B4513] flex items-center justify-center text-white text-3xl font-bold shadow-md overflow-hidden">
            {displayFoto
              ? <img src={displayFoto} alt="Foto profil" className="w-full h-full object-cover" />
              : <span>{(user?.name ?? "U")[0].toUpperCase()}</span>
            }
          </div>
          <button
            onClick={() => fileRef.current.click()}
            className="absolute -bottom-2 -right-2 w-7 h-7 bg-[#8B4513] hover:bg-[#7a3c10] text-white rounded-full flex items-center justify-center shadow-md transition-colors"
            title="Ganti foto"
          >
            <MdOutlineCameraAlt className="text-sm" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFotoChange}
            className="hidden"
          />
        </div>

        <div>
          <p className="font-semibold text-[#3E2C1C]">{user?.name ?? "-"}</p>
          <p className="text-sm text-gray-500">{user?.email ?? "-"}</p>
          <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#f5ede6] text-[#8B4513] capitalize">
            {user?.role ?? "-"}
          </span>
          <p className="text-xs text-gray-400 mt-2">
            Klik ikon kamera untuk mengganti foto profil
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Nama Lengkap"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Masukkan nama lengkap"
        />
        <InputField
          label="Email"
          value={user?.email ?? ""}
          disabled
          placeholder="Email tidak dapat diubah"
        />
        <InputField
          label="Role"
          value={user?.role ?? ""}
          disabled
        />
      </div>

      <div className="mt-5">
        <SaveButton onClick={handleSave} saved={saved} />
      </div>
    </SectionCard>
  );
}

// ─── KEAMANAN (GANTI PASSWORD) ───────────────────────────────────────────────
function KeamananSection() {
  const [form, setForm] = useState({ lama: "", baru: "", konfirmasi: "" });
  const [show, setShow] = useState({ lama: false, baru: false, konfirmasi: false });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const toggle = (field) => setShow((s) => ({ ...s, [field]: !s[field] }));

  const handleSave = () => {
    setError("");
    if (!form.lama || !form.baru || !form.konfirmasi) {
      setError("Semua kolom wajib diisi.");
      return;
    }
    if (form.baru !== form.konfirmasi) {
      setError("Password baru dan konfirmasi tidak cocok.");
      return;
    }
    if (form.baru.length < 6) {
      setError("Password baru minimal 6 karakter.");
      return;
    }
    setForm({ lama: "", baru: "", konfirmasi: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const PasswordField = ({ field, label }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <div className="relative">
        <input
          type={show[field] ? "text" : "password"}
          value={form[field]}
          onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
          placeholder="••••••••"
          className="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 text-sm text-[#3E2C1C] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 outline-none transition-all duration-200"
        />
        <button
          type="button"
          onClick={() => toggle(field)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B4513] transition-colors"
        >
          {show[field] ? <MdOutlineVisibilityOff className="text-lg" /> : <MdOutlineVisibility className="text-lg" />}
        </button>
      </div>
    </div>
  );

  return (
    <SectionCard icon={<MdOutlineLock />} title="Keamanan">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PasswordField field="lama" label="Password Lama" />
        <div />
        <PasswordField field="baru" label="Password Baru" />
        <PasswordField field="konfirmasi" label="Konfirmasi Password Baru" />
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-500 font-medium">{error}</p>
      )}

      <div className="mt-5">
        <SaveButton onClick={handleSave} saved={saved} />
      </div>
    </SectionCard>
  );
}

// ─── PENGATURAN TOKO (admin only) ───────────────────────────────────────────
function PengaturanTokoSection() {
  const [form, setForm] = useState({
    namaToko: "Toko Widi",
    alamat: "Jl. Contoh No. 1, Kota Pekanbaru",
    telepon: "081234567890",
    email: "tokiwidi@email.com",
    deskripsi: "Toko sembako dan kebutuhan sehari-hari.",
  });
  const [saved, setSaved] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <SectionCard icon={<MdOutlineStore />} title="Pengaturan Toko">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Nama Toko" value={form.namaToko} onChange={set("namaToko")} placeholder="Nama toko" />
        <InputField label="Nomor Telepon" value={form.telepon} onChange={set("telepon")} placeholder="08xxxxxxxxxx" />
        <InputField label="Email Toko" value={form.email} onChange={set("email")} placeholder="email@toko.com" />
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-medium text-gray-600">Alamat</label>
          <input
            value={form.alamat}
            onChange={set("alamat")}
            placeholder="Masukkan alamat lengkap"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#3E2C1C] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 outline-none transition-all duration-200"
          />
        </div>
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-medium text-gray-600">Deskripsi Toko</label>
          <textarea
            rows={3}
            value={form.deskripsi}
            onChange={set("deskripsi")}
            placeholder="Deskripsi singkat toko..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#3E2C1C] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 outline-none transition-all duration-200 resize-none"
          />
        </div>
      </div>

      <div className="mt-5">
        <SaveButton onClick={handleSave} saved={saved} />
      </div>
    </SectionCard>
  );
}

// ─── NOTIFIKASI (karyawan only) ─────────────────────────────────────────────
function NotifikasiSection() {
  const [prefs, setPrefs] = useState({
    stokRendah: true,
    transaksiMasuk: true,
    pesananBaru: false,
    laporanHarian: false,
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const items = [
    { key: "stokRendah", label: "Peringatan stok rendah", desc: "Notifikasi ketika stok produk hampir habis" },
    { key: "transaksiMasuk", label: "Transaksi masuk", desc: "Notifikasi setiap ada transaksi baru" },
    { key: "pesananBaru", label: "Pesanan baru", desc: "Notifikasi ketika ada pesanan masuk" },
    { key: "laporanHarian", label: "Laporan harian", desc: "Ringkasan aktivitas toko setiap hari" },
  ];

  return (
    <SectionCard icon={<MdOutlineNotifications />} title="Preferensi Notifikasi">
      <div className="space-y-4">
        {items.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div>
              <p className="text-sm font-semibold text-[#3E2C1C]">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
            <button
              onClick={() => toggle(key)}
              className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
                prefs[key] ? "bg-[#8B4513]" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${
                  prefs[key] ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <SaveButton onClick={handleSave} saved={saved} />
      </div>
    </SectionCard>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Settings() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isKaryawan = user?.role === "karyawan";

  return (
    <div id="settings-page" className="space-y-6">
      <PageHeader />

      <ProfilSection user={user} />
      <KeamananSection />

      {isAdmin && <PengaturanTokoSection />}

      {isKaryawan && <NotifikasiSection />}
    </div>
  );
}

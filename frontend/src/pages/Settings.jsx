import { useState, useRef } from "react";
import {
  MdOutlinePerson,
  MdOutlineLock,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
  MdOutlineCheckCircle,
  MdOutlineCameraAlt,
} from "react-icons/md";
import PageHeader from "../components/PageHeader";
import ConfirmModal from "../components/ConfirmModal";
import { useAuth } from "../context/AuthContext";

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

function SaveButton({ onClick, saved, loading }) {
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
          disabled={loading}
          className="px-6 py-2.5 bg-[#8B4513] hover:bg-[#7a3c10] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
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

const compressImage = (dataUrl, maxSize = 200, quality = 0.75) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = dataUrl;
  });

// ─── PROFIL AKUN ────────────────────────────────────────────────────────────
function ProfilSection({ user }) {
  const { foto, updateProfile } = useAuth();
  const [nama, setNama] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [pendingFoto, setPendingFoto] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const compressed = await compressImage(ev.target.result);
      setPendingFoto(compressed);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setError("");
    setLoading(true);
    try {
      await updateProfile(nama, pendingFoto ?? undefined, email);
      setPendingFoto(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Gagal menyimpan profil.");
    } finally {
      setLoading(false);
    }
  };

  const displayFoto = pendingFoto ?? foto;

  return (
    <>
      <h3 className="flex items-center gap-2 text-base font-bold text-[#3E2C1C] mb-5">
        <MdOutlinePerson className="text-xl text-[#8B4513]" /> Profil Akun
      </h3>

      <div className="flex items-center gap-6 mb-6">
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
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
        </div>

        <div>
          <p className="font-semibold text-[#3E2C1C]">{user?.name ?? "-"}</p>
          <p className="text-sm text-gray-500">{user?.email ?? "-"}</p>
          <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#f5ede6] text-[#8B4513] capitalize">
            {user?.role ?? "-"}
          </span>
          <p className="text-xs text-gray-400 mt-2">Klik ikon kamera untuk mengganti foto profil</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Nama Lengkap" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Masukkan nama lengkap" />
        <InputField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Masukkan email" />
        <InputField label="Role" value={user?.role ?? ""} disabled />
      </div>

      {error && <p className="mt-3 text-sm text-red-500 font-medium">{error}</p>}

      <div className="mt-5">
        <SaveButton onClick={handleSave} saved={saved} loading={loading} />
      </div>
    </>
  );
}

// ─── KEAMANAN (GANTI PASSWORD) ───────────────────────────────────────────────
function KeamananSection() {
  const { updatePassword } = useAuth();
  const [form, setForm] = useState({ lama: "", baru: "", konfirmasi: "" });
  const [show, setShow] = useState({ lama: false, baru: false, konfirmasi: false });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggle = (field) => setShow((s) => ({ ...s, [field]: !s[field] }));

  const handleSave = async () => {
    setError("");
    if (!form.lama || !form.baru || !form.konfirmasi) { setError("Semua kolom wajib diisi."); return; }
    if (form.baru !== form.konfirmasi) { setError("Password baru dan konfirmasi tidak cocok."); return; }
    if (form.baru.length < 6) { setError("Password baru minimal 6 karakter."); return; }

    setLoading(true);
    try {
      await updatePassword(form.lama, form.baru, form.konfirmasi);
      setForm({ lama: "", baru: "", konfirmasi: "" });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Gagal mengubah password.");
    } finally {
      setLoading(false);
    }
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
        <button type="button" onClick={() => toggle(field)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B4513] transition-colors">
          {show[field] ? <MdOutlineVisibilityOff className="text-lg" /> : <MdOutlineVisibility className="text-lg" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <h3 className="flex items-center gap-2 text-base font-bold text-[#3E2C1C] mb-5">
        <MdOutlineLock className="text-xl text-[#8B4513]" /> Keamanan
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PasswordField field="lama" label="Password Lama" />
        <div />
        <PasswordField field="baru" label="Password Baru" />
        <PasswordField field="konfirmasi" label="Konfirmasi Password Baru" />
      </div>

      {error && <p className="mt-3 text-sm text-red-500 font-medium">{error}</p>}

      <div className="mt-5">
        <SaveButton onClick={handleSave} saved={saved} loading={loading} />
      </div>
    </>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Settings() {
  const { user } = useAuth();

  return (
    <div id="settings-page" className="space-y-6">
      <PageHeader />

      <div className="tabs tabs-lift">
        <input type="radio" name="settings_tabs" className="tab" aria-label="Profil Akun" defaultChecked />
        <div className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <ProfilSection user={user} />
        </div>

        <input type="radio" name="settings_tabs" className="tab" aria-label="Keamanan" />
        <div className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <KeamananSection />
        </div>
      </div>
    </div>
  );
}

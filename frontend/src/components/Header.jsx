import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, foto } = useAuth();
  const inisial = (user?.name ?? "U")[0].toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 gap-4">
      <div className="flex items-center gap-4 ml-auto">
        {/* Avatar */}
        <button className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300 hover:border-[#8B4513] transition-all">
          {foto ? (
            <img src={foto} alt="Foto profil" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#8B4513] flex items-center justify-center text-white text-xs font-bold">
              {inisial}
            </div>
          )}
        </button>
      </div>
    </header>
  );
}

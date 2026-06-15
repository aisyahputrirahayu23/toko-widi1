export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />

      {/* Card */}
      <div className="relative bg-white rounded-2xl shadow-xl px-10 py-8 flex flex-col items-center gap-4 min-w-[280px]">
        {/* Ikon peringatan */}
        <div className="w-16 h-16 rounded-full border-4 border-orange-400 flex items-center justify-center">
          <span className="text-orange-400 text-3xl font-bold leading-none">!</span>
        </div>

        {/* Pesan */}
        <p className="text-[#3E2C1C] font-semibold text-lg text-center">{message}</p>

        {/* Tombol */}
        <div className="flex gap-3 mt-1">
          <button
            onClick={onConfirm}
            className="px-7 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Ya
          </button>
          <button
            onClick={onCancel}
            className="px-7 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

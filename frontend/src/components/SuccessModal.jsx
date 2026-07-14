import { MdCheckCircle } from "react-icons/md";

export default function SuccessModal({ isOpen, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white rounded-2xl shadow-xl px-10 py-8 flex flex-col items-center gap-4 min-w-[280px]">
        <div className="w-16 h-16 rounded-full border-4 border-green-400 flex items-center justify-center">
          <MdCheckCircle className="text-green-400 text-4xl" />
        </div>
        <p className="text-[#3E2C1C] font-semibold text-lg text-center">{message}</p>
      </div>
    </div>
  );
}

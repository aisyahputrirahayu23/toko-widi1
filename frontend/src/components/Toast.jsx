import { MdCheckCircle, MdError, MdInfo } from "react-icons/md";

const icons = {
  success: <MdCheckCircle className="text-xl shrink-0" />,
  error:   <MdError className="text-xl shrink-0" />,
  info:    <MdInfo className="text-xl shrink-0" />,
};

const alertClass = {
  success: "alert-success",
  error:   "alert-error",
  info:    "alert-info",
};

export default function Toast({ toasts }) {
  if (!toasts.length) return null;

  return (
    <div className="toast toast-end toast-top z-[9999] gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`alert ${alertClass[t.type] ?? "alert-success"} shadow-lg max-w-sm text-sm animate-in`}
        >
          {icons[t.type] ?? icons.success}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

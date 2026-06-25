import { useId } from "react";

export default function Pagination({ page, total, perPage, onChange }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const from = (page - 1) * perPage + 1;
  const to   = Math.min(page * perPage, total);
  const name = useId();

  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
      <p className="text-xs text-gray-400">
        Menampilkan {from}–{to} dari {total} data
      </p>
      <div className="join">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <input
            key={p}
            className="join-item btn btn-square btn-sm appearance-none"
            type="radio"
            name={name}
            aria-label={String(p)}
            checked={p === page}
            onChange={() => onChange(p)}
          />
        ))}
      </div>
    </div>
  );
}

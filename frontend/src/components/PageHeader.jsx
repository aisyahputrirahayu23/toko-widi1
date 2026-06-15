import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const pages = {
  "/dashboard":    { title: "Dashboard",     subtitle: null },
  "/inventory":    { title: "Inventory",     subtitle: null },
  "/reports":      { title: "Reports",       subtitle: null },
  "/transactions": { title: "Transaksi",     subtitle: null },
  "/users":        { title: "Kelola User",   subtitle: null },
  "/suppliers":    { title: "Supplier",      subtitle: null },
  "/orders":       { title: "Orders",        subtitle: null },
  "/settings":     { title: "Settings",      subtitle: null },
};

export default function PageHeader() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const page = pages[pathname];

  if (!page) return null;

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex flex-col">
        <span className="text-3xl font-semibold">{page.title}</span>
        <div className="flex items-center font-medium space-x-2 mt-2">
          {pathname === "/dashboard" ? (
            <span className="text-gray-500">Welcome back, {user?.name ?? "Admin"} 👋</span>
          ) : (
            <span className="text-gray-500">Toko Widi / {page.title}</span>
          )}
        </div>
      </div>
    </div>
  );
}

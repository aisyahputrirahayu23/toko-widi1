import { NavLink, useNavigate } from "react-router-dom";
import {
  MdOutlineDashboard,
  MdOutlineInventory2,
  MdOutlineBarChart,
  MdOutlineReceiptLong,
  MdOutlineLocalShipping,
  MdOutlinePeopleAlt,
  MdOutlineSettings,
  MdOutlineLogout,
} from "react-icons/md";
import logo from "../assets/logoo.png";
import { useAuth } from "../context/AuthContext";

const menuClass = ({ isActive }) =>
  `flex items-center px-5 py-3 mx-4 rounded-xl transition-all duration-300 text-sm ${
    isActive
      ? "bg-[#8B4513] text-white shadow-md"
      : "text-gray-600 hover:bg-[#f5ede6] hover:text-[#8B4513]"
  }`;

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isAdmin = user?.role === "admin";
  const isKaryawan = user?.role === "karyawan";

  return (
    <div className="flex min-h-screen w-72 flex-col bg-white border-r border-gray-200 shadow-sm">
      {/* LOGO */}
      <div className="px-6 py-8 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#8B4513] flex items-center justify-center shadow-md">
            <img src={logo} alt="Toko Widi" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#4B2E19] leading-none">Toko Widi</h1>
            <p className="text-xs text-gray-500 mt-1">
              {isAdmin ? "Administrator" : "Karyawan"}
            </p>
          </div>
        </div>
      </div>

      {/* MENU */}
      <div className="mt-6 flex-1">
        <ul className="space-y-2">
          <li>
            <NavLink to="/dashboard" className={menuClass}>
              <MdOutlineDashboard className="mr-3 text-xl" />
              Dashboard
            </NavLink>
          </li>

          {/* Admin: read-only inventory */}
          {isAdmin && (
            <li>
              <NavLink to="/inventory" className={menuClass}>
                <MdOutlineInventory2 className="mr-3 text-xl" />
                Inventory
              </NavLink>
            </li>
          )}

          {/* Admin: reports */}
          {isAdmin && (
            <li>
              <NavLink to="/reports" className={menuClass}>
                <MdOutlineBarChart className="mr-3 text-xl" />
                Reports
              </NavLink>
            </li>
          )}

          {/* Admin: kelola user */}
          {isAdmin && (
            <li>
              <NavLink to="/users" className={menuClass}>
                <MdOutlinePeopleAlt className="mr-3 text-xl" />
                Kelola User
              </NavLink>
            </li>
          )}

          {/* Karyawan: inventory dengan CRUD */}
          {isKaryawan && (
            <li>
              <NavLink to="/inventory" className={menuClass}>
                <MdOutlineInventory2 className="mr-3 text-xl" />
                Inventory
              </NavLink>
            </li>
          )}

          {/* Karyawan: supplier */}
          {isKaryawan && (
            <li>
              <NavLink to="/suppliers" className={menuClass}>
                <MdOutlineLocalShipping className="mr-3 text-xl" />
                Supplier
              </NavLink>
            </li>
          )}

          {/* Karyawan: transaksi */}
          {isKaryawan && (
            <li>
              <NavLink to="/transactions" className={menuClass}>
                <MdOutlineReceiptLong className="mr-3 text-xl" />
                Transaksi
              </NavLink>
            </li>
          )}
        </ul>
      </div>

      {/* FOOTER */}
      <div className="border-t border-gray-100 py-5">
        <ul className="space-y-2">
          <li>
            <NavLink to="/settings" className={menuClass}>
              <MdOutlineSettings className="mr-3 text-xl" />
              Settings
            </NavLink>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center w-[calc(100%-32px)] mx-4 px-5 py-3 rounded-xl text-sm text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all duration-300"
            >
              <MdOutlineLogout className="mr-3 text-xl" />
              Log Out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

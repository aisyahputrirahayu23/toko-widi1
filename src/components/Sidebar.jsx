import { Link, NavLink } from "react-router-dom";
import {
  MdOutlineDashboard,
  MdOutlineInventory2,
  MdOutlineBarChart,
  MdOutlinePeopleAlt,
  MdOutlineReceiptLong,
  MdOutlineStorefront,
  MdOutlineSettings,
  MdOutlineLogout,
} from "react-icons/md";

const menuClass = ({ isActive }) =>
  `flex items-center px-6 py-3 mx-3 rounded-lg transition-all duration-200 ${
    isActive
      ? "bg-orange-100 text-orange-500 font-medium"
      : "text-gray-400 hover:bg-orange-100 hover:text-orange-500"
  }`;

export default function Sidebar() {
  return (
    <div
      id="sidebar"
      className="flex min-h-screen w-64 flex-col bg-white py-6 shadow-xs border-r border-gray-200"
    >
      {/* Logo Section */}
      <div id="sidebar-logo" className="px-6 mb-8 flex items-center gap-2">
        <div className="w-10 h-10 bg-orange-50 rounded-md flex items-center justify-center">
          {/* Ganti src dengan path logo asli kamu */}
          {/* <img src="" alt="Olehly Logo" className="w-8 h-8 object-contain" /> */}
        </div>
        <span className="text-lg font-bold text-orange-900">OLEHLY</span>
      </div>

      {/* Main Navigation */}
      <div id="sidebar-menu" className="mt-6">
        <ul id="menu-list" className="space-y-1">
          <li>
            <NavLink 
                to="/dashboard" 
                id="menu-1" 
                className={menuClass}>
              <MdOutlineDashboard className="mr-3 text-lg" />
              <span className="text-sm">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
                to="/inventory" 
                id="menu-2" 
                className={menuClass}>
              <MdOutlineInventory2 className="mr-3 text-lg" />
              <span className="text-sm">Inventory</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
                to="/reports" 
                id="menu-3" 
                className={menuClass}>
              <MdOutlineBarChart className="mr-3 text-lg" />
              <span className="text-sm">Reports</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
                to="/suppliers" 
                id="menu-4" 
                className={menuClass}>
              <MdOutlinePeopleAlt className="mr-3 text-lg" />
              <span className="text-sm">Suppliers</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
                to="/orders" 
                id="menu-5" 
                className={menuClass}>
              <MdOutlineReceiptLong className="mr-3 text-lg" />
              <span className="text-sm">Orders</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
                to="/manage-store" 
                id="menu-6"    
                className={menuClass}>
              <MdOutlineStorefront className="mr-3 text-lg" />
              <span className="text-sm">Manage Store</span>
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Bottom Section (Settings & Logout) */}
      <div
        id="sidebar-footer"
        className="mt-auto pt-4 border-t border-gray-200"
      >
        <ul className="space-y-1">
          <li>
            <NavLink 
                to="/settings" 
                id="menu-7" 
                className={menuClass}>
              <MdOutlineSettings className="mr-3 text-lg" />
              <span className="text-sm">Settings</span>
            </NavLink>
          </li>
          <li>
            <button className="w-58 flex items-center px-6 py-3 mx-3 rounded-lg text-gray-400 hover:bg-red-100 hover:text-red-500 transition-all duration-200">
              <MdOutlineLogout className="mr-3 text-lg" />
              <span className="text-sm">Log Out</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

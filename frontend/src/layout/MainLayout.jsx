import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  return (
    <>
      <div id="app-container" className="bg-gray-100 min-h-screen flex">
        <div id="layout-wrapper" className="flex flex-row flex-1">
          <Sidebar />
          <div id="main-content" className="flex-1 p-4 flex flex-col overflow-hidden">
            <Header />
            <div className="flex-1 min-h-0 overflow-y-auto">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full bg-[#f5f1eb]">
      <Outlet />
    </div>
  );
}

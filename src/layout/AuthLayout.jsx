import { Outlet } from "react-router-dom";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-sans">
      <div className="flex w-full max-w-7xl flex-col md:flex-row items-center p-6 md:p-12 gap-12 lg:gap-24">
        
        {/* SISI KIRI: Branding & Logo Besar */}
        <div className="hidden md:flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-lg">
             {/* <img 
              src="/assets/logo-large.png" 
              alt="Olehly Store Branding" 
              className="w-full h-auto object-contain"
            /> */}
          </div>
        </div>

        {/* SISI KANAN: Tempat Form */}
        <div className="flex flex-1 flex-col items-center w-full max-w-md">
          {/* <img 
            src="/assets/logo-small.png" 
            alt="Olehly Logo" 
            className="w-16 h-16 object-contain mb-6"
          /> */}
          
          <Outlet />
        </div>

      </div>
    </div>
  );
}
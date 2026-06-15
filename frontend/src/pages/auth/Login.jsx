import { useNavigate } from "react-router-dom";
import logo from "../../assets/logoo.png";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy Login
    localStorage.setItem("isLogin", "true");

    // Redirect ke dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex bg-[#f5f1eb]">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-[#f3eee7]">
        <div className="text-center max-w-xl">
          {/* LOGO */}
          <img
            src={logo}
            alt="Logo"
            className="w-[380px] mx-auto drop-shadow-md"
          />

          {/* BRAND */}
          <h1 className="mt-8 text-6xl font-extrabold tracking-tight text-[#4B2E19]">
            Toko Widi
          </h1>

          {/* LINE */}
          <div className="w-24 h-1 bg-[#8B4513] mx-auto rounded-full mt-5"></div>

          {/* SUBTITLE */}
          <p className="mt-6 text-2xl text-[#7A624B] leading-relaxed font-medium">
            Sistem Manajemen Toko Oleh-oleh
            <br />
            Modern dan Efisien
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-lg bg-white p-12 rounded-[35px] shadow-2xl">
          {/* HEADER */}
          <div className="mb-8">
            <h2 className="text-5xl font-bold text-[#3E2C1C] leading-tight">
              Welcome <br /> Back 👋
            </h2>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* EMAIL */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Email
              </label>

              <input
                type="email"
                placeholder="Masukkan email"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#8B4513] text-base"
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#8B4513] text-base"
                required
              />
            </div>

            {/* OPTIONS */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input type="checkbox" />
                Remember me
              </label>

              <a
                href="/forgot"
                className="font-semibold text-[#8B4513] hover:underline"
              >
                Forgot password
              </a>
            </div>

            {/* SIGN IN */}
            <button
              type="submit"
              className="w-full py-4 bg-[#8B4513] hover:bg-[#6f360d] text-white font-semibold rounded-2xl transition-all duration-300 text-lg"
            >
              Sign in
            </button>
          </form>

          {/* FOOTER */}
          <p className="mt-8 text-base text-slate-500 text-center">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-bold text-[#8B4513] hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

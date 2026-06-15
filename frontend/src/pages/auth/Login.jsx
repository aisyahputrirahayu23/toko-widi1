import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logoo.png";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f5f1eb]">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-[#f3eee7]">
        <div className="text-center max-w-xl">
          <img src={logo} alt="Logo" className="w-[380px] mx-auto drop-shadow-md" />
          <h1 className="mt-8 text-6xl font-extrabold tracking-tight text-[#4B2E19]">
            Toko Widi
          </h1>
          <div className="w-24 h-1 bg-[#8B4513] mx-auto rounded-full mt-5"></div>
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
          <div className="mb-8">
            <h2 className="text-5xl font-bold text-[#3E2C1C] leading-tight">
              Welcome <br /> Back 👋
            </h2>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#8B4513] text-base"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#8B4513] text-base"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="/forgot" className="font-semibold text-[#8B4513] hover:underline">
                Forgot password
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#8B4513] hover:bg-[#6f360d] disabled:opacity-60 text-white font-semibold rounded-2xl transition-all duration-300 text-lg"
            >
              {loading ? "Masuk..." : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-base text-slate-500 text-center">
            Don't have an account?{" "}
            <a href="/register" className="font-bold text-[#8B4513] hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

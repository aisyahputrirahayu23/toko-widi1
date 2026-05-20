import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from 'react-icons/fc';

export default function Login() {
  return (
    <>
      <div className="text-center w-full">
        <h2 className="text-3xl font-bold text-slate-800">Log in to your account</h2>
        <p className="text-slate-500 mt-2 mb-8 text-sm">Welcome back! Please enter your details.</p>
      </div>

      <form className="w-full space-y-5">
        {/* Input Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input 
            type="email" 
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm"
          />
        </div>

        {/* Input Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input 
            type="password" 
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm"
          />
        </div>

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
            <span className="text-xs text-slate-600">Remember for 30 days</span>
          </label>
          <a href="/forgot" className="text-xs font-semibold text-orange-900 hover:underline">Forgot password</a>
        </div>

        {/* Submit Button - Pakai warna amber/orange yang tersedia di Tailwind */}
        <button 
          type="submit" 
          className="w-full py-3 bg-amber-900 hover:bg-amber-950 text-white font-semibold rounded-xl shadow-sm transition-colors text-sm"
        >
          Sign in
        </button>

        {/* Google Button */}
        <button 
          type="button" 
          className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-all text-sm"
        >
          <FcGoogle className="text-xl" />
          Sign in with Google
        </button>
      </form>

      {/* Footer Link */}
      <p className="mt-8 text-sm text-slate-500">
        Don't have an account? <a href="/register" className="font-bold text-orange-900 hover:underline">Sign up</a>
      </p>
    </>
  );
}
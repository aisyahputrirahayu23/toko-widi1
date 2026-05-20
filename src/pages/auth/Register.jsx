import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from 'react-icons/fc';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add registration logic here
    console.log("Register:", formData);
  };

  return (
    <>
      <div className="text-center w-full">
        <h2 className="text-3xl font-bold text-slate-800">Create your account</h2>
        <p className="text-slate-500 mt-2 mb-8 text-sm">Join us today and get started in minutes.</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-5">
        {/* Input Full Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="fullName" className="text-sm font-medium text-slate-700">Full Name</label>
          <input 
            id="fullName"
            type="text" 
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm"
          />
        </div>

        {/* Input Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
          <input 
            id="email"
            type="email" 
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm"
          />
        </div>

        {/* Input Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
          <input 
            id="password"
            type="password" 
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm"
          />
        </div>

        {/* Input Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">Confirm Password</label>
          <input 
            id="confirmPassword"
            type="password" 
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm"
          />
        </div>

        {/* Agree Terms */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" 
          />
          <span className="text-xs text-slate-600">I agree to the <a href="#" className="font-semibold text-orange-900 hover:underline">Terms & Conditions</a></span>
        </label>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full py-3 bg-amber-900 hover:bg-amber-950 text-white font-semibold rounded-xl shadow-sm transition-colors text-sm"
        >
          Create Account
        </button>

        {/* Google Button */}
        <button 
          type="button" 
          className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-all text-sm"
        >
          <FcGoogle className="text-xl" />
          Sign up with Google
        </button>
      </form>

      {/* Footer Link */}
      <p className="mt-8 text-sm text-slate-500">
        Already have an account? <a href="/" className="font-bold text-orange-900 hover:underline">Sign in</a>
      </p>
    </>
  );
}

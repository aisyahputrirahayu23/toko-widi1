import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add forgot password logic here
    console.log("Reset password for:", email);
    setSubmitted(true);
  };

  return (
    <>
      {!submitted ? (
        <>
          <div className="text-center w-full">
            <h2 className="text-3xl font-bold text-slate-800">Forgot your password?</h2>
            <p className="text-slate-500 mt-2 mb-8 text-sm">No worries! Enter your email and we'll send you instructions to reset your password.</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            {/* Input Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
              <input 
                id="email"
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full py-3 bg-amber-900 hover:bg-amber-950 text-white font-semibold rounded-xl shadow-sm transition-colors text-sm"
            >
              Send Reset Instructions
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-8 text-sm text-slate-500">
            Remember your password? <a href="/" className="font-bold text-orange-900 hover:underline">Sign in</a>
          </p>
        </>
      ) : (
        <>
          <div className="text-center w-full py-12">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Check your email</h2>
            <p className="text-slate-500 mt-2 mb-8 text-sm">We've sent password reset instructions to <span className="font-semibold text-slate-700">{email}</span></p>
            <p className="text-slate-500 text-sm">Didn't receive the email? Check your spam folder or <a href="#" className="font-semibold text-orange-900 hover:underline">try another email</a></p>
          </div>

          {/* Back to Login Link */}
          <p className="mt-12 text-sm text-slate-500 text-center">
            <a href="/" className="font-bold text-orange-900 hover:underline">Back to sign in</a>
          </p>
        </>
      )}
    </>
  );
}

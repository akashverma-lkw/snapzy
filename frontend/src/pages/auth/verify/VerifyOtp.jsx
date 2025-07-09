import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { IoReload } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa";

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location?.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [isResending, setIsResending] = useState(false);

  // Prevent access if no email
  useEffect(() => {
    if (!email) {
      toast.error("Access denied. Please signup again.");
      navigate("/");
    }
  }, [email, navigate]);

  // Resend OTP cooldown timer
  useEffect(() => {
    if (resendCooldown === 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Verification failed");
      } else {
        toast.success("Email verified! Please login.");
        navigate("/", { state: { openLogin: true } }); // Open login modal
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to resend OTP");
      } else {
        toast.success("OTP resent to your email.");
        setResendCooldown(30); // Restart cooldown
      }
    } catch (err) {
      toast.error("Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-8 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#000000] text-white">
      <div className="w-full max-w-md bg-white/10 p-8 rounded-2xl shadow-xl border border-white/10 backdrop-blur-lg animate-fade-in">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-indigo-400 mb-4">
          Email Verification
        </h2>
        <p className="text-sm text-gray-300 text-center mb-6">
          We’ve sent a 6-digit OTP to
          <br />
          <span className="font-semibold text-indigo-200">{email}</span>
        </p>

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            pattern="\d{6}"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-gray-500 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-lg font-semibold shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <FaSpinner className="animate-spin" />}
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Resend */}
        <div className="mt-6 text-center">
          {resendCooldown > 0 ? (
            <p className="text-sm text-gray-400">
              Resend OTP in{" "}
              <span className="text-indigo-300 font-medium">{resendCooldown}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-sm text-indigo-300 hover:text-indigo-400 font-medium underline transition flex items-center justify-center gap-1"
            >
              {isResending ? (
                <>
                  <FaSpinner className="animate-spin" /> Resending...
                </>
              ) : (
                <>
                  <IoReload /> Resend OTP
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;

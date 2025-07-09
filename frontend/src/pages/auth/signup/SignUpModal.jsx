import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import {
  MdOutlineMail,
  MdPassword,
  MdDriveFileRenameOutline,
} from "react-icons/md";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const SignUpModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const otpRefs = useRef([]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    let timer;
    if (emailSent && !emailVerified && countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [emailSent, emailVerified, countdown]);

  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      return data;
    },
    onSuccess: () => {
      toast.success("OTP sent to your email!");
      setEmailSent(true);
      setCountdown(30);
      setCanResend(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const enteredOtp = otp.join("");
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: enteredOtp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP verification failed");
      return data;
    },
    onSuccess: () => {
      toast.success("Email verified successfully!");
      setEmailVerified(true);
    },
    onError: (err) => toast.error(err.message),
  });

  const signupMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create account");
      return data;
    },
    onSuccess: () => {
      toast.success("Account created successfully!");
      onClose();
      navigate("/", { state: { email: formData.email } });
    },
    onError: (err) => toast.error(err.message),
  });

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit if last digit is entered and all are filled
    if (index === 5 && newOtp.every((digit) => digit !== "")) {
      verifyOtpMutation.mutate();
    }
  };


  const handleResendOtp = () => {
    sendOtpMutation.mutate();
    setCountdown(30);
    setCanResend(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!emailSent) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error("Enter a valid email");
        return;
      }
      sendOtpMutation.mutate();
      return;
    }

    if (!emailVerified) {
      const isComplete = otp.every((digit) => digit !== "");
      if (!isComplete) {
        toast.error("Please enter all OTP digits");
        return;
      }
      verifyOtpMutation.mutate();
      return;
    }

    signupMutation.mutate();
  };

  if (!isOpen) return null;

  const Spinner = () => (
    <svg
      className="animate-spin h-5 w-5 text-white inline-block ml-2"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      ></path>
    </svg>
  );


  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 animate-fade-in">
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl text-white w-full max-w-md rounded-2xl p-8 relative shadow-2xl animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition"
        >
          <IoClose size={26} />
        </button>

        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-400">
          Create Your Snapzy Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username & Full Name */}
          <div className="flex flex-col md:flex-row gap-4">
            <label className="flex items-center gap-3 flex-1 bg-white/10 px-4 py-3 rounded-xl border border-gray-600">
              <MdDriveFileRenameOutline className="text-xl text-indigo-300" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="w-full bg-transparent outline-none text-white placeholder-gray-300"
                required
              />
            </label>

            <label className="flex items-center gap-3 flex-1 bg-white/10 px-4 py-3 rounded-xl border border-gray-600">
              <FaUser className="text-xl text-indigo-300" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
                className="w-full bg-transparent outline-none text-white placeholder-gray-300"
                required
              />
            </label>
          </div>

          {/* Email */}
          <label className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl border border-gray-600">
            <MdOutlineMail className="text-2xl text-indigo-300" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full bg-transparent outline-none text-white placeholder-gray-300"
              required
            />
          </label>

          {/* Password */}
          <label className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl border border-gray-600">
            <MdPassword className="text-2xl text-indigo-300" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full bg-transparent outline-none text-white placeholder-gray-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-indigo-300 hover:text-indigo-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </label>

          {/* OTP Inputs */}
          {emailSent && !emailVerified && (
            <div>
              <div className="flex justify-between gap-2 mb-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => (otpRefs.current[index] = el)}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    className="w-10 h-10 text-center text-lg rounded bg-white/10 border border-gray-600 text-white outline-none"
                  />
                ))}
              </div>
              <div className="text-center text-sm text-gray-300">
                {canResend ? (
                  <button
                    onClick={handleResendOtp}
                    type="button"
                    className="text-indigo-400 underline"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p>Resend in {countdown}s</p>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold transition shadow-md disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {!emailSent
              ? sendOtpMutation.isPending
                ? <>Sending OTP <Spinner /></>
                : "Send OTP"
              : !emailVerified
                ? verifyOtpMutation.isPending
                  ? <>Verifying OTP <Spinner /></>
                  : "Verify OTP"
                : signupMutation.isPending
                  ? <>Creating Account <Spinner /></>
                  : "Sign Up"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default SignUpModal;


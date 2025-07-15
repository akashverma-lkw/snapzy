import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { IoMdLogIn } from "react-icons/io";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const AdminLoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
      } else {
        localStorage.setItem("adminToken", data.token);
        onClose();
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 animate-fade-in">
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl text-white w-full max-w-md rounded-2xl p-8 relative shadow-2xl animate-scale-in">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition"
          aria-label="Close Modal"
        >
          <IoClose size={26} />
        </button>

        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-400">
          Admin Portal 👨‍💻
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <label className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl border border-gray-600 focus-within:ring-2 focus-within:ring-indigo-400">
            <MdOutlineMail className="text-2xl text-indigo-300" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Admin Email"
              className="w-full bg-transparent outline-none text-white placeholder-gray-300"
              required
            />
          </label>

          {/* Password */}
          <label className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl border border-gray-600 focus-within:ring-2 focus-within:ring-indigo-400">
            <MdPassword className="text-2xl text-indigo-300" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full bg-transparent outline-none text-white placeholder-gray-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-indigo-300 hover:text-indigo-400"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
            <IoMdLogIn className="text-xl" />
          </button>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center mt-2">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;

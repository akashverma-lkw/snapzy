import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import {
  MdOutlineMail,
  MdPassword,
  MdDriveFileRenameOutline,
} from "react-icons/md";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

  const [showPassword, setShowPassword] = useState(false); // 👁️ Password visibility state
  const queryClient = useQueryClient();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, fullName, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create account");

      localStorage.setItem("token", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Account created successfully!");
      onClose();
      navigate("/"); // stay on front page after signup
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 animate-fade-in">
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl text-white w-full max-w-md rounded-2xl p-8 relative shadow-2xl animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition"
          aria-label="Close Signup Modal"
        >
          <IoClose size={26} />
        </button>

        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-400">
          Create Your Snapzy Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Username and Full Name */}
          <div className="flex flex-col md:flex-row gap-4">
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
          </div>

          {/* Password with Eye Toggle */}
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
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold transition shadow-md disabled:opacity-50"
          >
            {isPending ? "Creating Account..." : "Sign Up"}
          </button>

          {/* Error */}
          {isError && (
            <p className="text-red-500 text-sm text-center">
              {error.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignUpModal;

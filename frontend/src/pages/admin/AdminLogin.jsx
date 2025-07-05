import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { IoMdLogIn } from "react-icons/io";

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | Snapzy</title>
      </Helmet>

      <div className="h-screen w-screen flex flex-col md:flex-row px-6 py-10 md:px-18 md:py-20 bg-gray-900">
        {/* Left Section */}
        <div className="md:flex-1 bg-indigo-800 text-white rounded-lg md:rounded-l-lg md:rounded-r-none flex flex-col justify-center items-start p-10 md:p-16 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-100">
            Welcome Admin
          </h1>
          <p className="text-md md:text-lg text-slate-300 max-w-md">
            Securely manage Snapzy 👨‍💻. Access admin tools and control the platform effectively.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-lg hover:opacity-90 transition"
          >
            Back to Home
          </button>
        </div>

        {/* Right Section */}
        <div className="md:flex-1 flex justify-center items-center bg-gray-800 rounded-lg md:rounded-r-lg md:rounded-l-none mt-6 md:mt-0">
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-5 w-full max-w-[400px] p-6 md:p-10 bg-gray-900 text-white rounded-lg shadow-xl"
          >
            <h2 className="text-2xl font-bold text-center">Admin Login</h2>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div className="flex items-center gap-3 bg-gray-700 rounded-lg px-4 py-2">
              <MdOutlineMail className="text-xl" />
              <input
                type="email"
                name="email"
                placeholder="Admin Email"
                className="bg-transparent w-full outline-none text-white"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex items-center gap-3 bg-gray-700 rounded-lg px-4 py-2">
              <MdPassword className="text-xl" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="bg-transparent w-full outline-none text-white"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Logging in..." : "Login"} <IoMdLogIn />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;

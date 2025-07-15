import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaHome, FaUsers, FaCogs, FaSignOutAlt } from "react-icons/fa";

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // ✅ Important fix: Use correct token key
    navigate("/"); // smoother redirect using navigate
    window.location.reload();
  };

  const navLinks = [
    { name: "Dashboard", icon: FaHome, path: "/admin/dashboard/home" },
    { name: "Users", icon: FaUsers, path: "/admin/dashboard/users" },
    { name: "Settings", icon: FaCogs, path: "/admin/dashboard/settings" },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Snapzy</title>
      </Helmet>

      <div className="min-h-screen flex w-full flex-col bg-gradient-to-br from-black via-gray-900 to-black text-white">
        {/* Top Navbar */}
        <header className="fixed w-full z-50 bg-gradient-to-r from-gray-900 to-black shadow-md px-6 md:px-16 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#FFD700] tracking-wide">Snapzy Admin</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition duration-300"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </header>

        {/* Main Content */}
        <div className="flex pt-20">
          {/* Sidebar */}
          <aside className="w-64 bg-[#111827] shadow-xl min-h-screen py-10 px-6 sticky top-20">
            <h2 className="text-xl font-semibold text-[#FFD700] text-center mb-10">Admin Panel</h2>
            <nav className="space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-md transition duration-300 ${
                    location.pathname === link.path
                      ? "bg-[#9A2D2D] text-white"
                      : "hover:bg-[#9A2D2D] hover:text-white text-gray-300"
                  }`}
                >
                  <link.icon className="text-lg" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Routed Page Content */}
          <main className="flex-1 p-6 md:p-10">
            <div className="p-8 min-h-[80vh] w-full bg-[#1f2937] rounded-xl shadow-lg">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;

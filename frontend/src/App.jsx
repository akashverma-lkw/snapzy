import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";
import { HelmetProvider } from "react-helmet-async";

import HomePage from "./pages/home/HomePage";

import LoginModal from "./pages/auth/login/LoginModal";
import SignUpModal from "./pages/auth/signup/SignUpModal";
import VerifyOtp from "./pages/auth/verify/VerifyOtp";

import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import FrontPage from "./pages/FrontPage/FrontPage";

import Navbar from "./components/common/Navbar";
import RightPanel from "./components/common/RightPanel";
import LeftPanel from "./components/common/LeftPanel";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Admin
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import ProtectedAdminRoute from "./components/adminProtectRoute/ProtectedAdminRoute";
import UserList from "./pages/admin/dashboard/UserList";
import DefaultAdminHome from "./pages/admin/dashboard/DefaultAdminHome";
import Settings from "./pages/admin/dashboard/Settings";

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const location = useLocation();

  const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error.message || "Something went wrong");
      }
    },
    retry: false,
  });

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isFrontPage = location.pathname === "/";

  // Show spinner while loading (except admin)
  if (isLoading && !isAdminRoute) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex mx-auto">
      {/* Show user layout components */}
      {!isAdminRoute && !isFrontPage && authUser && <Navbar />}
      {!isAdminRoute && !isFrontPage && authUser && <LeftPanel />}

      <HelmetProvider>
        <Routes>
          {/* Public Route */}
          <Route
            path="/"
            element={
              <FrontPage
                openLoginModal={() => setIsLoginOpen(true)}
                openSignupModal={() => setIsSignupOpen(true)}
              />
            }
          />

          {/* Protected User Routes */}
          <Route path="/homepage" element={authUser ? <HomePage /> : <Navigate to="/" />}/>
          <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/" />}/>
          <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/" />}/>
          <Route path="/verify-otp" element={<VerifyOtp />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<DefaultAdminHome />} />
            <Route path="home" element={<DefaultAdminHome />} />
            <Route path="users" element={<UserList />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>

        {/* Modals */}
        {isLoginOpen && (
          <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        )}
        {isSignupOpen && (
          <SignUpModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
        )}
      </HelmetProvider>

      {!isAdminRoute && !isFrontPage && authUser && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;

import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import FrontPage from "./pages/FrontPage/FrontPage";

import Navbar from "./components/common/Navbar";
import RightPanel from "./components/common/RightPanel";
import LeftPanel from "./components/common/LeftPanel";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

// admin
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import ProtectedAdminRoute from "./components/adminProtectRoute/ProtectedAdminRoute";
import UserList from "./pages/admin/dashboard/UserList";
import DefaultAdminHome from "./pages/admin/dashboard/DefaultAdminHome";
import Settings from "./pages/admin/dashboard/Settings";

function App() {
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
                throw new Error(error);
            }
        },

        retry: false,
    });

    // Check if current route is admin
    const isAdminRoute = location.pathname.startsWith("/admin");

    if (isLoading && !isAdminRoute) {
        return (
            <div className='h-screen flex justify-center items-center'>
                <LoadingSpinner size='lg' />
            </div>
        );
    }

    return (
        <div className='flex mx-auto'>
            {!isAdminRoute && authUser && <Navbar />}
            {!isAdminRoute && authUser && <LeftPanel />}

            <HelmetProvider>
                <Routes>
                    {/* 👨‍💻 User Routes */}
                    <Route path='/' element={<FrontPage />} />
                    <Route path='/homepage' element={<HomePage />} />
                    <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/homepage' />} />
                    <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/homepage' />} />
                    <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
                    <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />

                    {/* 🛡️ Admin Routes */}
                    <Route path='/admin/login' element={<AdminLogin />} />
                    <Route
                        path='/admin/dashboard'
                        element={
                            <ProtectedAdminRoute>
                                <AdminDashboard />
                            </ProtectedAdminRoute>
                        }
                    >
                        <Route index element={<DefaultAdminHome />} />
                        <Route path='home' element={<DefaultAdminHome />} />
                        <Route path='users' element={<UserList />} />
                        <Route path='settings' element={<Settings />} />
                    </Route>

                </Routes>
            </HelmetProvider>

            {!isAdminRoute && authUser && <RightPanel />}
            <Toaster />
        </div>
    );
}

export default App;

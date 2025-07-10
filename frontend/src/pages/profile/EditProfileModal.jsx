import { useEffect, useState } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaUser, FaUserTag, FaLock, FaLink, FaInfoCircle } from "react-icons/fa";

const EditProfileModal = ({ authUser }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

  const confirmDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users/delete-account/${authUser._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Account deleted successfully");
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to delete account");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName,
        username: authUser.username,
        bio: authUser.bio,
        link: authUser.link,
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [authUser]);

  return (
    <>
      <button
        className="btn btn-outline rounded-full btn-sm"
        onClick={() => document.getElementById("edit_profile_modal").showModal()}
      >
        Edit profile
      </button>

      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box relative border rounded-md mt-8 border-gray-700 shadow-md w-full max-w-xl scrollbar-hide">
          <form method="dialog" className="absolute right-2 top-2">
            <button className="text-gray-500 hover:text-red-500 text-xl font-bold">&times;</button>
          </form>

          <h3 className="font-bold text-lg my-3">Update Profile</h3>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile(formData);
            }}
          >
            {/* Full Name */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label htmlFor="fullName" className="w-full sm:w-32 text-sm font-medium text-gray-400 dark:text-gray-300 flex items-center">
                <FaUser className="mr-1" /> Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500"
                value={formData.fullName}
                name="fullName"
                onChange={handleInputChange}
              />
            </div>

            {/* Username */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label htmlFor="username" className="w-full sm:w-32 text-sm font-medium text-gray-400 dark:text-gray-300 flex items-center">
                <FaUserTag className="mr-1" /> Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Choose a username"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500"
                value={formData.username}
                name="username"
                onChange={handleInputChange}
              />
            </div>

            {/* Bio */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2">
              <label htmlFor="bio" className="w-full sm:w-32 text-sm font-medium text-gray-400 dark:text-gray-300 flex items-center">
                <FaInfoCircle className="mr-1" /> Bio
              </label>
              <textarea
                id="bio"
                placeholder="Write a short bio..."
                className="w-full p-2 resize-none border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500"
                value={formData.bio}
                name="bio"
                onChange={handleInputChange}
              />
            </div>

            {/* Current Password */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label htmlFor="currentPassword" className="w-full sm:w-32 text-sm font-medium text-gray-400 dark:text-gray-300 flex items-center">
                <FaLock className="mr-1" /> Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500"
                value={formData.currentPassword}
                name="currentPassword"
                onChange={handleInputChange}
              />
            </div>

            {/* New Password */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label htmlFor="newPassword" className="w-full sm:w-32 text-sm font-medium text-gray-400 dark:text-gray-300 flex items-center">
                <FaLock className="mr-1" /> New Password
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500"
                value={formData.newPassword}
                name="newPassword"
                onChange={handleInputChange}
              />
            </div>

            {/* Link */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label htmlFor="link" className="w-full sm:w-32 text-sm font-medium text-gray-400 dark:text-gray-300 flex items-center">
                <FaLink className="mr-1" /> Website Link
              </label>
              <input
                id="link"
                type="text"
                placeholder="https://yourwebsite.com"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500"
                value={formData.link}
                name="link"
                onChange={handleInputChange}
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all text-sm"
              >
                {isUpdatingProfile ? "Updating..." : "Update Profile"}
              </button>

              <button
                type="button"
                className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-all text-sm"
                onClick={() => {
                  document.getElementById("edit_profile_modal").close();
                  setShowDeleteConfirm(true);
                }}
              >
                Delete My Account
              </button>
            </div>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button className="outline-none">close</button>
        </form>
      </dialog>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Are you sure?</h3>
            <p className="mb-6 text-gray-700">
              This action cannot be undone. Your account will be permanently deleted.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAccount}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfileModal;

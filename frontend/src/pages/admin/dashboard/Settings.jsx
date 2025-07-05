import React, { useState } from 'react';

const Settings = () => {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('⚠️ New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setMessage('Please log in first.');
        return;
      }

      const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

      // Step 1: Verify old password
      const verifyRes = await fetch(`${API_URL}/api/admin/verify-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        setMessage('⚠️ Old password is incorrect');
        return;
      }

      // Step 2: Update email/password
      const updateRes = await fetch(`${API_URL}/api/admin/update-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const updateData = await updateRes.json();

      if (updateRes.ok && updateData.success) {
        setMessage('✅ Settings updated successfully!');
        setEmail('');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage(updateData.message || '❌ Failed to update settings');
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 bg-gray-900 text-white rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold text-[#FFD700] mb-8 text-center">Admin Settings</h2>

      {message && (
        <div className="mb-4 text-center text-sm font-medium text-yellow-300">{message}</div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label htmlFor="email" className="block mb-2 font-semibold">Admin Email</label>
          <input
            type="email"
            id="email"
            required
            placeholder="Enter new admin email"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="oldPassword" className="block mb-2 font-semibold">Old Password</label>
          <input
            type="password"
            id="oldPassword"
            required
            placeholder="Enter current password"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block mb-2 font-semibold">New Password</label>
          <input
            type="password"
            id="newPassword"
            required
            placeholder="Enter new password"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block mb-2 font-semibold">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            required
            placeholder="Confirm new password"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition duration-300 ${
            loading
              ? 'bg-yellow-300 text-black cursor-not-allowed'
              : 'bg-[#FFD700] text-black hover:bg-yellow-500'
          }`}
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default Settings;

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    const confirmed = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/users/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      toast.success('User deleted successfully');
      fetchUsers(); // refresh list
    } catch (error) {
      toast.error('Error deleting user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-[#F4E1C1]">
      <h2 className="text-3xl font-semibold mb-6 text-[#7A3C3C]">Registered Users</h2>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-t-4 border-indigo-600 rounded-full"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">No users found.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full text-left text-[#7A3C3C]">
            <thead className="bg-[#7A3C3C] text-white text-center">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">Username</th>
                <th className="p-4">Email</th>
                <th className="p-4">Followers</th>
                <th className="p-4">Following</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} className="border-b hover:bg-[#F9F9F9] text-center">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{user.fullName}</td>
                  <td className="p-4">@{user.username}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.followers?.length || 0}</td>
                  <td className="p-4">{user.following?.length || 0}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => alert(`User: ${user.fullName}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                      >
                        View
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;

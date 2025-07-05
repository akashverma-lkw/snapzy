import { useState, useEffect } from "react";

const useAdminStats = () => {
  const [stats, setStats] = useState({ users: 0, posts: 0 });
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resUsers = await fetch(`${API_URL}/api/admin/users`);
        const resPosts = await fetch(`${API_URL}/api/admin/posts`);
        const users = await resUsers.json();
        const posts = await resPosts.json();
        setStats({ users: users.length, posts: posts.length });
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
};

export default useAdminStats;

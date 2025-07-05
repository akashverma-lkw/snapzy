import React from 'react';
import useAdminStats from './hooks/useAdminStats';

const DefaultAdminHome = () => {
  const { stats, loading } = useAdminStats();

  const boxStyle =
    'w-40 h-40 rounded-lg flex flex-col justify-center items-center bg-[#9A2D2D] text-white shadow-lg hover:scale-105 transition-transform duration-300';

  return (
    <div className="flex flex-col justify-center items-center text-center w-full min-h-[calc(100vh-350px)]">
      <h2 className="text-4xl font-bold text-[#FFD700] mb-10">Admin Dashboard Overview</h2>

      {loading ? (
        <div className="text-lg text-yellow-300 animate-pulse">Loading stats...</div>
      ) : (
        <div className="flex gap-10 flex-wrap justify-center">
          <div className={boxStyle}>
            <h3 className="text-4xl font-bold">{stats.users}</h3>
            <p className="text-md mt-2">Total Users</p>
          </div>
          
          <div className={boxStyle}>
            <h3 className="text-4xl font-bold">{stats.posts}</h3>
            <p className="text-md mt-2">Total Posts</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DefaultAdminHome;

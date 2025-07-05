import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaNewspaper, FaFire, FaRocket, FaGamepad, FaLightbulb, FaComments, FaImage, FaBrain, FaUser, FaChartBar } from 'react-icons/fa';

const news = [
  { text: "🚀 Breaking News: Snapzy is now live with AI integration!", icon: <FaRocket className="text-yellow-400" /> },
  { text: "💡 Tech Update: Gemini API is trending in 2025", icon: <FaLightbulb className="text-blue-400" /> },
  { text: "🎯 New Feature: Tic Tac Toe Mini Game Added!", icon: <FaGamepad className="text-green-400" /> },
  { text: "🔥 Milestone: SignUp Right Now to explore things!", icon: <FaFire className="text-red-400" /> },
  { text: "✨ Stay Tuned: More Exciting Features Coming Soon!", icon: <FaNewspaper className="text-pink-400" /> },
  { text: "📸 Snapzy introduces Image Upload Feature!", icon: <FaImage className="text-purple-400" /> },
  { text: "💬 Snapzy's Comment and Like System is now live!", icon: <FaComments className="text-orange-400" /> },
  { text: "🧠 Ask AI Feature powered by Gemini API is ready to assist!", icon: <FaBrain className="text-teal-400" /> },
  { text: "🎨 Profile Customization Feature is available!", icon: <FaUser className="text-indigo-400" /> },
  { text: "📊 Snapzy's User Engagement at its Peak!", icon: <FaChartBar className="text-gray-400" /> }
];

const LeftPanel = () => {
  const [currentNews, setCurrentNews] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNews((prev) => (prev + 1) % news.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:block max-w-72 min-h-screen bg-gradient-to-b from-gray-900 to-black border-r border-gray-700 shadow-2xl rounded-xl p-6 overflow-hidden relative mx-auto my-24">
      <div className="text-white text-3xl font-bold flex items-center justify-center border-b border-gray-700 py-4 tracking-wide uppercase animate-pulse">
        <FaNewspaper className="mr-3 text-red-400" /> News & Updates
      </div>
      <div className="h-[60vh] flex flex-col items-center justify-center relative overflow-hidden">
        {news.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={index === currentNews ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className={`absolute w-full flex flex-col items-center justify-center ${index === currentNews ? "block" : "hidden"}`}
          >
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-2xl shadow-lg p-6 w-60 text-center border border-gray-600 transform hover:scale-105 transition-all duration-500">
              <div className="text-5xl mb-2 animate-bounce">{item.icon}</div>
              <p className="text-lg text-gray-300 font-medium">{item.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LeftPanel;

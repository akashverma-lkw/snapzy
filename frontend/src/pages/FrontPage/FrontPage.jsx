import React from "react";
import { motion } from "framer-motion";
import {
  FaCommentDots,
  FaUserShield,
  FaRobot,
  FaGamepad,
  FaRegHeart,
} from "react-icons/fa";

const features = [
  {
    icon: <FaCommentDots className="text-blue-400 text-3xl" />,
    title: "Post & Comment",
    desc: "Create posts, share thoughts, and chat with the community.",
  },
  {
    icon: <FaRegHeart className="text-pink-400 text-3xl" />,
    title: "Like Instantly",
    desc: "Show appreciation with just one tap.",
  },
  {
    icon: <FaRobot className="text-green-400 text-3xl" />,
    title: "Gemini AI",
    desc: "Smart assistant to answer your curiosities instantly.",
  },
  {
    icon: <FaGamepad className="text-yellow-400 text-3xl" />,
    title: "Play vs AI",
    desc: "Challenge Snapzy's Tic Tac Toe AI — pure fun!",
  },
  {
    icon: <FaUserShield className="text-red-400 text-3xl" />,
    title: "Admin Control",
    desc: "Admins maintain peace by removing inappropriate users/posts.",
  },
];

const FrontPage = ({ openLoginModal, openSignupModal }) => {
  return (
    <div className="bg-gradient-to-b from-[#0a0a0a] via-[#0d1b2a] to-[#000814] text-white min-h-screen font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col justify-center items-center text-center px-6">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-10"></div>

        <div className="z-10">
          <motion.h1
            className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Snapzy – Your Social Hub
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-300 mt-6 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            Dive into a vibrant world where you connect, share, play, and interact — powered by AI.
          </motion.p>

          {/* Mini Feature Tags */}
          <motion.div
            className="mt-10 flex justify-center gap-6 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <span className="flex items-center gap-2 bg-[#1e2a45] px-4 py-2 rounded-full text-sm text-gray-300">
              <FaCommentDots className="text-blue-400" /> Social Sharing
            </span>
            <span className="flex items-center gap-2 bg-[#1e2a45] px-4 py-2 rounded-full text-sm text-gray-300">
              <FaRobot className="text-green-400" /> Ask Gemini AI
            </span>
            <span className="flex items-center gap-2 bg-[#1e2a45] px-4 py-2 rounded-full text-sm text-gray-300">
              <FaGamepad className="text-yellow-400" /> Mini Games
            </span>
          </motion.div>

          {/* Auth Buttons */}
          <motion.div
            className="mt-10 flex justify-center gap-6 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <button
              onClick={openLoginModal}
              className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white font-semibold shadow-md hover:scale-105"
            >
              Already have an account? Login
            </button>
            <button
              onClick={openSignupModal}
              className="px-6 py-3 rounded-full border border-gray-400 hover:border-white transition-all duration-300 text-white font-semibold shadow-md hover:scale-105"
            >
              New here? Sign Up
            </button>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="px-6 md:px-16 py-16 bg-[#0f1e34] rounded-t-3xl shadow-inner">
        <h2 className="text-3xl font-bold text-center mb-12">Why You'll Love Snapzy 💙</h2>
        <div className="grid md:grid-cols-3 gap-10 cursor-pointer">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-[#112240] bg-opacity-60 p-6 rounded-2xl shadow-lg transition-all duration-300 backdrop-blur-md"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#010409] py-8 text-center text-gray-500 text-sm mt-20">
        Made with ❤️ by Akash Verma · © {new Date().getFullYear()} Snapzy
      </footer>
    </div>
  );
};

export default FrontPage;

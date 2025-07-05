import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const news = [
  "Snapzy is now live with advanced AI integration.",
  "Gemini API reshaping social content in 2025.",
  "Tic Tac Toe Mini Game launched on Snapzy.",
  "Sign up today and unlock premium features.",
  "New: Image Upload & Post Engagement Features.",
  "Ask AI — Powered by Google's Gemini API.",
  "Like & Comment system is now available.",
  "Snapzy: Designed for Creators & Communities.",
  "Stay tuned: Profile Themes & More Coming Soon.",
  "Peak user engagement achieved on Snapzy!"
];

const FrontPage = () => {
  const navigate = useNavigate();
  const [currentNews, setCurrentNews] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    const interval = setInterval(() => {
      setCurrentNews((prev) => (prev + 1) % news.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet>
        <title>Snapzy | Connect. Create. Engage.</title>
      </Helmet>

      <div className="flex flex-col items-center justify-center min-h-screen w-full px-6 bg-gradient-to-br from-gray-950 to-gray-950 text-white">
        {/* Branding */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-lg text-center mt-8"
        >
          Snapzy
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-sm sm:text-2xl md:text-3xl font-semibold text-gray-300 mt-2"
        >
          The Next-Gen Social Media Platform
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-2xl text-center text-gray-400 text-lg sm:text-xl mt-4 px-4"
        >
          Snapzy empowers you to express, engage, and expand your digital presence. Seamlessly connect with like-minded creators, share your world, and interact through innovative features — all in one place.
        </motion.p>

        {/* News Ticker */}
        <div
          data-aos="fade-up"
          className="mt-10 w-full max-w-3xl bg-gray-800/80 rounded-lg p-4 shadow-md border border-gray-700"
        >
          <h3 className="text-center text-lg sm:text-xl font-semibold text-blue-400 tracking-wide mb-2">
            🔔 Platform Updates
          </h3>
          <div className="overflow-hidden h-10 flex items-center justify-center">
            {news.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={index === currentNews ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className={`text-sm sm:text-base text-gray-300 ${index === currentNews ? "block" : "hidden"}`}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hero CTA Section */}
        <div className="mt-12 flex flex-col-reverse md:flex-row items-center justify-between w-full max-w-6xl px-4 md:px-10 gap-10">
          {/* Left CTA */}
          <motion.div
            data-aos="fade-right"
            className="md:w-1/2 space-y-6 text-left"
          >
            <h2 className="text-xl sm:text-3xl font-bold text-white">
              Join a community built for creators & conversations
            </h2>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
              Whether you’re an artist, influencer, or innovator — Snapzy offers tools designed to elevate your voice. Your platform. Your pace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105"
              >
                Get Started
              </button>
              <Link
                to="/signup"
                className="text-blue-400 hover:underline text-sm mt-2 sm:mt-3"
              >
                New here? Create your account
              </Link>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            data-aos="fade-left"
            className="hidden lg:flex lg:w-1/2 justify-center"
          >
            <img
              src="https://unmistakablecreative.com/wp-content/uploads/2023/09/image-5.png"
              alt="Snapzy Interface"
              className="rounded-xl shadow-xl h-64 md:h-80 object-cover"
            />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default FrontPage;

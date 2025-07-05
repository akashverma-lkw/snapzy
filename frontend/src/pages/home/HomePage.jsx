import { useState } from "react";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";
import { Helmet } from "react-helmet-async";
import ErrorBoundary from "../../ErrorBoundry/ErrorBoundry";
import { motion } from "framer-motion";

const HomePage = () => {
    const [feedType, setFeedType] = useState("forYou");

    return (
        <>
            <Helmet>
                <title>Home | Snapzy</title>
            </Helmet>

            <div className="flex-[4_4_0] mx-auto border-r border-l mt-16 border-gray-700 min-h-screen w-full max-w-2xl mr-10">
                {/* Header */}
                <motion.div 
                    className="flex w-full border-b border-gray-700 bg-black/60 backdrop-blur-lg sticky top-0 z-20 shadow-md"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {['forYou', 'following'].map((type) => (
                        <motion.div
                            key={type}
                            className={`flex justify-center flex-1 p-3 cursor-pointer relative text-sm sm:text-base transition-all duration-300 ${feedType === type ? "font-bold text-yellow-500" : "text-gray-400 hover:text-white"}`}
                            onClick={() => setFeedType(type)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {type === "forYou" ? "For You" : "Following"}
                            {feedType === type && (
                                <motion.div
                                    layoutId="underline"
                                    className="absolute bottom-0 w-10 h-1 rounded-full bg-yellow-500"
                                    transition={{ type: "spring", stiffness: 300 }}
                                />
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* CREATE POST INPUT */}
                <motion.div 
                    className="px-2 sm:px-4 py-4 border-b border-gray-700"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <CreatePost />
                </motion.div>

                {/* POSTS */}
                <motion.div 
                    className="px-2 sm:px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <ErrorBoundary>
                        <Posts feedType={feedType} />
                    </ErrorBoundary>
                </motion.div>
            </div>
        </>
    );
};

export default HomePage;

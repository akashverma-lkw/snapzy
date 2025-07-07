import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const AiAskModal = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
      setResponse("");
      setError("");
      setQuestion("");
    }

    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setResponse("");
    setError("");

    try {
      const endpoint = new URL(`/api/ai/ask`, API_URL).toString();

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
        credentials: "include",
      });

      if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format.");
      }

      const data = await res.json();
      setResponse(data?.response || "Sorry, I couldn't process your question.");
      setQuestion(""); // Clear input after successful submission
    } catch (err) {
      console.error("Error fetching AI response:", err);
      setError("An error occurred while fetching the response.");
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 px-4">
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-[#111827] w-full max-w-xl rounded-xl shadow-lg p-6 relative"
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
          onClick={onClose}
          aria-label="Close"
        >
          <IoClose size={22} />
        </button>

        {/* Modal Heading */}
        <h2 className="text-2xl font-semibold text-center text-white mb-4">Ask AI Anything</h2>

        {/* Input Field */}
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="Type your question here..."
          className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Ask Button */}
        <button
          onClick={handleAsk}
          disabled={loading}
          className="mt-4 w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center transition"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Thinking...
            </>
          ) : (
            "Ask"
          )}
        </button>

        {/* Response/Error Section */}
        {(response || error) && (
          <div className="mt-4 p-4 border border-gray-600 rounded-md bg-gray-800 max-h-60 overflow-y-auto text-sm text-gray-200">
            {response && <p>{response}</p>}
            {error && <p className="text-red-400">{error}</p>}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AiAskModal;

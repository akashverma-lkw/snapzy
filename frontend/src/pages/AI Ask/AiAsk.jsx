// Import same as before
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { Typewriter } from "react-simple-typewriter";

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const AiAskModal = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [chatHistory, setChatHistory] = useState(() =>
    JSON.parse(localStorage.getItem("chatHistory") || "[]")
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef(null);

  const playSound = (src) => {
    const audio = new Audio(src);
    audio.play().catch((e) => console.warn("Audio error:", e));
  };

<<<<<<< HEAD
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

=======
>>>>>>> 07cb2ad (Reinitialized project)
  // Voice recognition setup
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const speech = event.results[0][0].transcript;
        setQuestion((prev) => prev + " " + speech);
      };

      recognition.onerror = (e) => {
        console.error("Speech recognition error:", e);
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
        playSound("/sounds/mic-off.mp3");
      };

      recognitionRef.current = recognition;
      setVoiceSupported(true);
    } else {
      setVoiceSupported(false);
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      playSound("/sounds/mic-off.mp3");
    } else {
      recognitionRef.current.start();
      setListening(true);
      playSound("/sounds/mic-on.mp3");
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
      resetState();
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  useEffect(() => {
    const valid = chatHistory.filter((c) => c.question?.trim() && c.response?.trim());
    localStorage.setItem("chatHistory", JSON.stringify(valid));
  }, [chatHistory]);

  const resetState = () => {
    setQuestion("");
    setResponse("");
    setError("");
    stopSpeech();
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setResponse("");
    setError("");
    stopSpeech();

    try {
      const endpoint = new URL("/api/ai/ask", API_URL).toString();
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
        credentials: "include",
      });

      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);

      const data = await res.json();
      const answer = data?.response || "Sorry, I couldn't process that.";
      setResponse(answer);
      setChatHistory((prev) => [...prev, { question, response: answer }]);
      setQuestion("");
      speakText(answer);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching the response.");
    }

    setLoading(false);
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    stopSpeech();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
  };

  const stopSpeech = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const clearAllHistory = () => {
    localStorage.removeItem("chatHistory");
    setChatHistory([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 px-4 backdrop-blur-sm">
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900 text-white w-full max-w-xl rounded-xl shadow-lg p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
        >
          <IoClose size={22} />
        </button>

        <h2 className="text-2xl font-semibold text-center mb-4">Ask AI Anything</h2>

        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            placeholder="Type or speak your question..."
            className="w-full px-4 py-2 pr-12 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {voiceSupported && (
            <button
              onClick={toggleListening}
              className={`absolute right-2 top-2.5 text-lg ${listening
                ? "text-red-400 animate-pulse"
                : "text-gray-400 hover:text-blue-400"
              }`}
              title={listening ? "Listening..." : "Start Voice Input"}
            >
              {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>
          )}
        </div>

        {!voiceSupported && (
          <p className="mt-2 text-xs text-yellow-400">
            ⚠️ Voice input not supported on this device or browser.
          </p>
        )}

        <button
          onClick={handleAsk}
          disabled={loading}
          className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition flex justify-center items-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
              </svg>
              Thinking...
            </>
          ) : (
            "Ask"
          )}
        </button>

        {(response || error) && (
          <div className="mt-4 p-4 border border-gray-700 bg-gray-800 rounded-md max-h-64 overflow-y-auto text-sm">
            {response && !loading && (
              <div className="prose prose-invert prose-sm">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            )}
            {loading && (
              <p className="text-blue-400">
                <Typewriter
                  words={["Thinking... Please wait..."]}
                  loop={1}
                  cursor
                  typeSpeed={60}
                  deleteSpeed={30}
                />
              </p>
            )}
            {error && <p className="text-red-400">{error}</p>}
          </div>
        )}

        {response && (
          <div className="mt-2 flex justify-end">
            {isSpeaking ? (
              <button
                onClick={stopSpeech}
                className="text-sm text-red-500 underline hover:text-red-400"
              >
                Stop Voice
              </button>
            ) : (
              <button
                onClick={() => speakText(response)}
                className="text-sm text-green-400 underline hover:text-green-300"
              >
                🔊 Speak Again
              </button>
            )}
          </div>
        )}

        {chatHistory.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-semibold text-gray-300">
                🕘 Previous Questions
              </h4>
              <button
                onClick={clearAllHistory}
                className="text-xs text-red-400 hover:underline"
              >
                Clear All
              </button>
            </div>
            <div className="max-h-40 overflow-y-auto text-xs space-y-2">
              {chatHistory.map((chat, index) => (
                <div key={index} className="border-b border-gray-700 pb-1">
                  <p><strong>You:</strong> {chat.question}</p>
                  <p><strong>AI:</strong> {chat.response}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AiAskModal;

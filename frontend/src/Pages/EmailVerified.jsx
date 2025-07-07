// frontend/src/pages/EmailVerified.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

function EmailVerified() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 text-white flex flex-col justify-center items-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/5 p-8 rounded-xl text-center shadow-xl border border-white/10"
      >
        <FaCheckCircle className="text-green-400 text-5xl mx-auto mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold mb-2 text-green-300">Email Verified 🎉</h2>
        <p className="text-gray-300 mb-6">Your email has been successfully verified. You can now log in to your account.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition shadow"
        >
          Go to Login
        </button>
      </motion.div>
    </div>
  );
}

export default EmailVerified;

import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "../axios";
import { loginSuccess } from "../redux/userSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("⚠️ Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const { token, user } = res.data;

      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Update Redux state
      dispatch(loginSuccess(user));

      // ✅ Toast & redirect
      toast.success("Logged in successfully!");

      setTimeout(() => {
        navigate("/app");
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };
const handleGoogleLogin = async () => {
  try {
    const res = await axios.get("/api/google/auth");

    if (res.data?.redirectUrl) {
      // 🧭 Manually redirect to Google
      window.location.href = res.data.redirectUrl;
    } else {
      console.error("Redirect URL not found in response.");
    }
  } catch (error) {
    console.error("Google login error:", error);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* 🔮 Background Glow */}
      <div className="absolute w-[600px] h-[600px] bg-purple-700 blur-3xl opacity-20 top-[-150px] right-[-150px] animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 w-full max-w-md bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/10"
      >
        <h2 className="text-3xl font-bold mb-4 text-center text-purple-400">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-300 mb-6 text-center">
          Log in to your Smart Assistant
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-300">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-semibold transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "🔐 Login"}
          </motion.button>
        </form>

        {/* ➕ Google OAuth Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-white text-black border border-gray-300 mt-4 py-2 rounded-md font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </motion.button>

        <p className="mt-4 text-sm text-gray-300 text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-purple-400 hover:underline">
            Signup
          </a>
        </p>

        <p className="text-xs text-center mt-4 text-gray-400">
          Made with 💡 by Jeet Goyal © {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
}

export default Login;

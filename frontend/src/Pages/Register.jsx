// src/pages/Register.jsx
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.password || !form.confirm) {
      toast.error("All fields are required");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/auth/register", {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
      });
      toast.success("✅ Registered successfully! Check your email to verify.");
    //   setTimeout(() => navigate("/verify-email"), 2500);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/10 backdrop-blur p-8 rounded-xl shadow-lg border border-white/10 text-white"
      >
        <h2 className="text-2xl font-bold text-center text-purple-400 mb-6">
          📝 Register
        </h2>

        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded bg-gray-800 text-white focus:outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded bg-gray-800 text-white focus:outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded bg-gray-800 text-white focus:outline-none"
        />

        <input
          type="password"
          name="confirm"
          placeholder="Confirm Password"
          value={form.confirm}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded bg-gray-800 text-white focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 transition px-4 py-3 rounded text-white font-semibold"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-4 text-sm text-gray-300 text-center">
          Already have an account? <a href="/login" className="text-purple-400 hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Register;

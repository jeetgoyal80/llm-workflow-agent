// frontend/src/axios.js
import axios from "axios";
import { toast } from "react-toastify"; // ✅ import toast

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// 🔐 Attach token if exists
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ⚠️ Global error toast
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error?.response?.data?.message || error.message || "Something went wrong";
    toast.error("❌ " + msg);
    return Promise.reject(error);
  }
);

export default instance;

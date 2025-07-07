import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🔉 Play sound effect
export const playToastSound = () => {
  const audio = document.getElementById("toast-sound");
  if (audio) audio.play().catch(() => {});
};

// ✅ Success Toast
export const toastSuccess = (msg) => {
  toast.success(msg);
  playToastSound();
};

// ❌ Error Toast
export const toastError = (msg) => {
  toast.error(msg);
  playToastSound();
};

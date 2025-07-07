import { useEffect, useState } from "react";
import axios from "../axios";
import { FaEdit, FaCamera } from "react-icons/fa";
import ChangePasswordModal from "../components/ChangePasswordModal";
import defaultAvatar from "../assets/image copy.png";
import { toast } from "react-toastify";

function Settings() {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/user/profile");
      setUser(res.data);
      setForm({ name: res.data.full_name, email: res.data.email });
    } catch (err) {
      toast.error(err,"Failed to load profile");
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.put("/api/user/profile", form);
      await fetchProfile();
      setEdit(false);
      toast.success("✅ Profile updated!");
    } catch (err) {
      toast.error(err,"❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      await axios.post("/api/user/upload-avatar", formData);
      await fetchProfile();
      toast.success("✅ Avatar updated!");
    } catch (err) {
      toast.error(err,"❌ Failed to upload avatar");
    }
  };

  const handlePasswordUpdate = async (data) => {
    try {
      await axios.post("/api/user/change-password", data);
      toast.success("✅ Password updated");
      setShowPasswordModal(false);
    } catch (err) {
      toast.error("❌ " + (err.response?.data?.message || "Update failed"));
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-6 py-12">
      <h1 className="mt-12 text-3xl font-bold text-purple-400 mb-10 text-center">
        👤 Profile & Settings
      </h1>

      {/* Profile Card */}
      <div className="max-w-3xl mx-auto bg-white/5 p-6 rounded-2xl shadow-md border border-white/10 flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <div className="relative">
          <img
            src={user?.avatar || defaultAvatar}
            alt="avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-purple-600"
          />
          <label
            htmlFor="avatarUpload"
            className="absolute bottom-1 right-1 bg-purple-700 p-1.5 rounded-full cursor-pointer hover:bg-purple-800 transition"
          >
            <FaCamera />
            <input
              id="avatarUpload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Info Form */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Personal Info</h2>
            {!edit && (
              <button
                onClick={() => setEdit(true)}
                className="text-sm text-purple-400 hover:underline flex items-center gap-1"
              >
                <FaEdit /> Edit
              </button>
            )}
          </div>

          <div className="space-y-3">
            <input
              type="text"
              disabled={!edit}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-gray-800 p-2 rounded text-white border border-white/10 focus:outline-none focus:ring focus:ring-purple-600"
              placeholder="Full Name"
            />
            <input
              type="email"
              disabled
              value={form.email}
              className="w-full bg-gray-800 p-2 rounded text-white border border-white/10 focus:outline-none focus:ring focus:ring-purple-600"
              placeholder="Email"
            />
          </div>

          {edit && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white transition"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEdit(false)}
                className="bg-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Credentials Info */}
      <div className="max-w-3xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <h3 className="text-sm text-purple-400 font-semibold mb-2">
            📧 Email SMTP
          </h3>
          <p className="text-sm text-gray-300 break-all">
            User: {user?.email_smtp?.user || "Not connected"}
          </p>
          <p className="text-sm text-gray-300">Password: ●●●●●●●●</p>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <h3 className="text-sm text-purple-400 font-semibold mb-2">
            📲 Twilio WhatsApp
          </h3>
          <p className="text-sm text-gray-300 break-all">
            SID: {user?.whatsapp?.sid || "Not connected"}
          </p>
          <p className="text-sm text-gray-300">Token: ●●●●●●●●</p>
        </div>
      </div>

      {/* Password Update */}
      <div className="text-center mt-10">
        <button
          onClick={() => setShowPasswordModal(true)}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-white font-semibold"
        >
          Change Password
        </button>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handlePasswordUpdate}
        />
      )}
    </div>
  );
}

export default Settings;

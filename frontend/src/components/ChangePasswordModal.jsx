import { useState } from "react";
import { FaLock } from "react-icons/fa";

function ChangePasswordModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ current: "", new: "", confirm: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.current || !form.new || !form.confirm) {
      setError("All fields are required.");
    } else if (form.new !== form.confirm) {
      setError("New passwords do not match.");
    } else {
      setError("");
      onSubmit(form);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md text-white">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FaLock /> Change Password
        </h2>
        <div className="space-y-3">
          <input
            name="current"
            type="password"
            placeholder="Current password"
            className="w-full p-2 rounded bg-gray-800"
            value={form.current}
            onChange={handleChange}
          />
          <input
            name="new"
            type="password"
            placeholder="New password"
            className="w-full p-2 rounded bg-gray-800"
            value={form.new}
            onChange={handleChange}
          />
          <input
            name="confirm"
            type="password"
            placeholder="Confirm new password"
            className="w-full p-2 rounded bg-gray-800"
            value={form.confirm}
            onChange={handleChange}
          />
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="bg-gray-700 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordModal;

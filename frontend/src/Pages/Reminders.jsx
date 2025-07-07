import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBell, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import axios from "../axios"; // Make sure this is properly configured

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [editedTime, setEditedTime] = useState("");

  // 📦 Fetch reminders from backend
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await axios.get("/api/reminders");
        setReminders(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch reminders:", err);
      }
    };
    fetchReminders();
  }, []);

  // 🛠 Start editing a reminder
  const startEditing = (reminder) => {
    setEditingId(reminder._id);
    setEditedText(reminder.message);
    setEditedTime(reminder.time);
  };

  // ❌ Cancel edit
  const cancelEditing = () => {
    setEditingId(null);
    setEditedText("");
    setEditedTime("");
  };

  // 💾 Save edited reminder
  const saveReminder = async (id) => {
    try {
      const res = await axios.put(`/api/reminders/${id}`, {
        message: editedText,
        time: editedTime,
      });
      setReminders((prev) =>
        prev.map((r) => (r._id === id ? res.data : r))
      );
      cancelEditing();
    } catch (err) {
      console.error("❌ Failed to update reminder:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-6 py-10">
      <motion.h1
        className="mt-10 text-3xl font-bold mb-8 text-purple-400 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🔔 Your Reminders
      </motion.h1>

      <div className="max-w-3xl mx-auto grid gap-6">
        {reminders.length === 0 ? (
          <p className="text-gray-400 text-center">No active reminders.</p>
        ) : (
          reminders.map((reminder, index) => (
            <motion.div
              key={reminder._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-md hover:shadow-lg transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="flex items-center gap-3 w-full">
                <FaBell className="text-yellow-400 animate-pulse mt-1" />
                {editingId === reminder._id ? (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full">
                    <input
                      type="text"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="bg-black/30 border border-purple-600 text-white rounded px-2 py-1 w-full sm:w-auto"
                    />
                    <input
                      type="text"
                      value={editedTime}
                      onChange={(e) => setEditedTime(e.target.value)}
                      className="bg-black/30 border border-purple-600 text-white rounded px-2 py-1 w-full sm:w-auto"
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="font-semibold text-white">{reminder.message}</h2>
                    <p className="text-sm text-gray-400">At: {new Date(reminder.time).toLocaleString()}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {editingId === reminder._id ? (
                  <>
                    <button
                      onClick={() => saveReminder(reminder._id)}
                      className="text-green-400 hover:text-green-500"
                      title="Save"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="text-red-400 hover:text-red-500"
                      title="Cancel"
                    >
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => startEditing(reminder)}
                    className="text-purple-400 hover:text-purple-500"
                    title="Edit Reminder"
                  >
                    <FaEdit />
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reminders;

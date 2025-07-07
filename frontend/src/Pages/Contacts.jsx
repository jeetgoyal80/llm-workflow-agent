import { useEffect, useState } from "react";
import axios from "../axios";
import { FaTrash, FaUserPlus } from "react-icons/fa";

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const fetchContacts = async () => {
    try {
      const res = await axios.get("/api/user/contacts");
      setContacts(res.data);
    } catch (err) {
      console.error("Failed to fetch contacts:", err.message);
    }
  };

  const handleAddContact = async () => {
    if (!form.name || (!form.email && !form.phone)) return;
    setLoading(true);
    try {
      await axios.post("/api/user/contacts", form);
      await fetchContacts();
      setForm({ name: "", email: "", phone: "" });
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (name) => {
    try {
      await axios.delete(`/api/user/contacts/${name}`);
      await fetchContacts();
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 text-white px-6 py-10">
      <h1 className="mt-12 text-4xl font-extrabold text-center mb-10 text-purple-400">📇 Manage Your Contacts</h1>

      {/* Add Contact Form */}
      <div className="max-w-3xl mx-auto bg-white/5 p-8 rounded-xl border border-white/10 shadow-lg mb-14">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Name"
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="tel"
            placeholder="WhatsApp Number"
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <button
          onClick={handleAddContact}
          disabled={loading}
          className="mt-6 w-full flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full transition"
        >
          <FaUserPlus /> {loading ? "Saving..." : "Add Contact"}
        </button>
      </div>

      {/* Contact List */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {contacts.map((c) => (
          <div
            key={c._id}
            className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-5 shadow-md hover:shadow-2xl transition-all"
          >
            <h3 className="text-xl font-semibold text-purple-300 mb-1">{c.name}</h3>
            {c.email && <p className="text-sm text-gray-300">📧 {c.email}</p>}
            {c.phone && <p className="text-sm text-gray-300 mt-1">📱 {c.phone}</p>}
            <button
              onClick={() => handleDelete(c.name)}
              className="mt-4 flex items-center gap-2 text-sm text-red-400 hover:text-red-500 hover:underline transition"
            >
              <FaTrash /> Delete
            </button>
          </div>
        ))}
      </div>

      {contacts.length === 0 && (
        <p className="text-center mt-16 text-gray-500">No contacts added yet.</p>
      )}
    </div>
  );
}

export default Contacts;

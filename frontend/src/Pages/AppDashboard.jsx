import { useState, useEffect } from "react";
import axios from "../axios";
import { Typewriter } from "react-simple-typewriter";
import { FaPlus, FaBars, FaTimes } from "react-icons/fa";

function AppDashboard() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load chat list on mount
  useEffect(() => {
    fetchChats();
  }, []);

  // Load messages when activeChat changes
  useEffect(() => {
    if (activeChat) fetchMessages(activeChat);
  }, [activeChat]);

  // Fetch all chats
  const fetchChats = async () => {
    try {
      const res = await axios.get("/api/chat");
      setChats(res.data.chats);
      if (res.data.chats.length > 0) {
        setActiveChat(res.data.chats[0]._id);
      }
    } catch (err) {
      console.error("Error fetching chats", err);
    }
  };

  // Fetch messages in chronological order
  const fetchMessages = async (chatId) => {
    try {
      const res = await axios.get(`/api/chat/${chatId}?page=1&limit=50`);
      // API returns oldest→newest; just set directly
      setMessages(res.data.messages);
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  // Send user input as task, show typing effect, then append assistant
  const handleSend = async () => {
    if (!input.trim() || !activeChat) return;

    const textToSend = input.trim();
    setInput("");
    setLoading(true);

    // Optimistically show user's message
    setMessages((prev) => [...prev, { sender: "user", text: textToSend }]);

    try {
      const isConfirming = /^(confirm|yes|send it|send)$/i.test(textToSend);
      const res = await axios.post("/api/task", {
        text: textToSend,
        chatId: activeChat,
        confirmed: isConfirming,
      });

      // Build combined assistant reply from results
      const assistantResults = res.data.results || [];
      let combinedReply = "";
      assistantResults.forEach((task) => {
        const { intent, status, reply = "", missing = [], info = {} } = task;
        if (status === "missing_info") {
          combinedReply += `🔍 Missing info for ${intent}: ${missing.join(", ")}\n`;
        } else if (status === "requires_confirmation") {
          combinedReply += `⚠️ Please confirm ${intent}:\n${JSON.stringify(
            info,
            null,
            2
          )}\n`;
        } else if (status === "success") {
          combinedReply += reply ? `✅ ${reply}\n` : `✅ ${intent} done.\n`;
        } else {
          combinedReply += reply ? `${reply}\n` : `${intent} result.\n`;
        }
      });

      // Trigger typing effect
      setTypingText(combinedReply.trim());
    } catch (err) {
      console.error("Error sending task", err);
      setTypingText("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Called when Typewriter finishes
  const handleTypingComplete = async () => {
    // Append assistant's typed text
    setMessages((prev) => [...prev, { sender: "assistant", text: typingText }]);
    setTypingText("");

    // Refresh from backend to sync any persisted messages
    await fetchMessages(activeChat);
  };

  // Create a new chat
  const startNewChat = async () => {
    try {
      const res = await axios.post("/api/chat/create");
      const newChat = res.data.chat;
      setChats((prev) => [newChat, ...prev]);
      setActiveChat(newChat._id);
      setMessages([]);
      setIsDrawerOpen(false);
    } catch (err) {
      console.error("Failed to start new chat", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-gradient-to-b from-gray-900 to-black text-white pt-20 relative">
      {/* Mobile Drawer Toggle */}
      {!isDrawerOpen && (
        <button
          className="sm:hidden fixed top-17 left-4 z-50 bg-purple-700 hover:bg-purple-800 p-2 rounded-lg shadow-md"
          onClick={() => setIsDrawerOpen(true)}
        >
          <FaBars />
        </button>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`pt-10 sm:hidden fixed top-0 left-0 z-40 h-full w-64 bg-black/90 backdrop-blur-md shadow-lg border-r border-white/10 transform transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-white/10">
          <h2 className="text-lg font-bold">Chats</h2>
          <button onClick={() => setIsDrawerOpen(false)} className="text-white">
            <FaTimes />
          </button>
        </div>
        <div className="p-4 flex flex-col h-full">
          <button
            onClick={startNewChat}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg mb-4 text-white font-semibold"
          >
            <FaPlus /> New Chat
          </button>
          <div className="overflow-y-auto space-y-2 text-sm text-white/80 flex-1">
            {chats.map((chat) => (
              <p
                key={chat._id}
                className={`cursor-pointer hover:text-white transition ${
                  activeChat === chat._id ? "text-purple-400" : ""
                }`}
                onClick={() => {
                  setActiveChat(chat._id);
                  setMessages([]);
                  setIsDrawerOpen(false);
                }}
              >
                ➤ {chat.title || "Untitled Chat"}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden sm:flex sm:w-64 sm:h-[calc(100vh-80px)] bg-black/30 border-r border-white/10 p-4 flex-col">
        <button
          onClick={startNewChat}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg mb-4 text-white font-semibold"
        >
          <FaPlus /> New Chat
        </button>
        <div className="overflow-y-auto space-y-2 text-sm text-white/80 flex-1">
          {chats.map((chat) => (
            <p
              key={chat._id}
              className={`cursor-pointer hover:text-white transition ${
                activeChat === chat._id ? "text-purple-400" : ""
              }`}
              onClick={() => {
                setActiveChat(chat._id);
                setMessages([]);
              }}
            >
              ➤ {chat.title || "Untitled Chat"}
            </p>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col h-[calc(100vh-80px)]">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[80%] px-4 py-2 rounded-lg shadow-md text-sm whitespace-pre-wrap ${
                msg.sender === "user"
                  ? "bg-purple-700 self-end ml-auto text-right"
                  : "bg-gray-800 self-start mr-auto"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {typingText && (
            <div className="max-w-[80%] px-4 py-2 rounded-lg bg-gray-800 self-start animate-pulse border border-purple-700">
              <Typewriter
                words={[typingText]}
                cursor
                cursorStyle="|"
                typeSpeed={40}
                deleteSpeed={50}
                delaySpeed={500}
                onLoopDone={handleTypingComplete}
              />
            </div>
          )}

          {loading && (
            <div className="text-gray-500 text-xs mt-2">Assistant is thinking...</div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 border-t border-white/10 bg-black/30 flex"
        >
          <input
            type="text"
            placeholder="Ask anything or create a task..."
            className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="ml-3 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full shadow-lg"
            disabled={loading}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default AppDashboard;

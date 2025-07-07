const Chat = require("../models/Chat");

// Create a new chat with default title
exports.createChat = async (req, res) => {
  try {
    const chat = new Chat({
      userId: req.user.id,
      title: "New Chat"
    });
    await chat.save();
    res.status(201).json({ chat });
  } catch (err) {
    res.status(500).json({ message: "Failed to create chat" });
  }
};

// Add a new message (user or assistant)
exports.addMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { sender, text } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    chat.messages.push({ sender, text });

    // Update chat title if it's the first message and still "New Chat"
    if (chat.messages.length === 1 && chat.title === "New Chat") {
      chat.title = text.slice(0, 50); // Set title from first user input
    }

    await chat.save();
    res.json({ message: "Message added" });
  } catch (err) {
    res.status(500).json({ message: "Failed to add message" });
  }
};

// Get paginated messages for a chat
// controllers/chatController.js


exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "20");

    // 1️⃣ Load chat
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // 2️⃣ Sort messages ascending by timestamp (oldest first)
    const sortedMessages = chat.messages.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    // 3️⃣ Paginate
    const start = (page - 1) * limit;
    const end = start + limit;
    const messages = sortedMessages.slice(start, end);

    return res.json({ messages });
  } catch (err) {
    console.error("Failed to fetch messages:", err);
    return res.status(500).json({ message: "Failed to fetch messages" });
  }
};


// Get all chats for a user
exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ chats });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch chats" });
  }
};
exports.updateChatTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const chat = await Chat.findByIdAndUpdate(id, { title }, { new: true });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    res.json({ message: "Title updated", chat });
  } catch (err) {
    res.status(500).json({ message: "Failed to update chat title" });
  }
};


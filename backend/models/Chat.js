const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["user", "assistant"] }, // restricts to known roles
  text: String, // message content
  timestamp: { type: Date, default: Date.now }, // automatic timestamp
});

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // reference to user
  title: { type: String, default: "New Chat" }, // chat title (updates with first message)
  messages: [messageSchema], // embedded messages
  createdAt: { type: Date, default: Date.now }, // automatic creation timestamp
});


module.exports = mongoose.model("Chat", chatSchema);

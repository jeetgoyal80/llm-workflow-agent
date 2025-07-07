// models/PendingTask.js
const mongoose = require("mongoose");

const pendingTaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  intent: { type: String, required: true },
  info: { type: mongoose.Schema.Types.Mixed, required: true },
  status: { type: String, enum: ["requires_confirmation", "missing_info"], required: true },
  missing: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now, expires: 600 } // Auto-delete in 10 mins
});

module.exports = mongoose.model("PendingTask", pendingTaskSchema);

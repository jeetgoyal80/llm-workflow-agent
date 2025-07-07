const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  task: {
    type: String,
    required: true
  },
  due: {
    type: Date,
    default: null
  },
  done: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Todo", todoSchema);

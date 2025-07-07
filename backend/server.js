// server.js
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const session = require("express-session");
const path = require("path");

const rescheduleReminders = require("./rescheduleReminders");
const { initSocket } = require("./socket");

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(morgan("dev"));
app.use(session({
  secret: process.env.SESSION_SECRET || "keyboard cat",
  resave: false,
  saveUninitialized: true
}));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ MongoDB connected".bgMagenta);
  rescheduleReminders(); // Re-initialize reminders if needed
}).catch((err) => {
  console.error("❌ MongoDB connection error:".bgRed, err);
});

// ✅ API Routes
app.use("/api/auth", require("./routes/auth"));            // User login/register
app.use("/api/google", require("./routes/google"));        // Google OAuth, Calendar
app.use("/api", require("./routes/task"));                 // Task routes (chatbot actions)
app.use("/api/user", require("./routes/user"));            // Contact management
app.use("/api/reminders", require("./routes/reminderRoutes"));
app.use("/api/todo", require("./routes/todo"));
app.use("/api/user", require("./routes/profile"));
app.use("/api/chat", require("./routes/chat"));

// ✅ Static Assets (for production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// ✅ WebSocket
initSocket(server);

// ✅ Server Start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`.bgBlue);
});

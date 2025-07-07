const { io } = require("../socket");
const schedule = require("node-schedule");
const Reminder = require("../models/Reminder");

async function ReminderAgent(userId, info) {
  const message = info.message || info.description;
  const timeStr = info.time;

  console.log("🚀 ReminderAgent called with:", { userId, message, timeStr });

  if (!message || !timeStr) {
    throw new Error("Reminder must include both a message and a time.");
  }

  // Convert string like "6 PM" or "7:45 pm" to Date
  let date = new Date(timeStr);
  if (isNaN(date.getTime())) {
    const now = new Date();
    const [hourStr, modifier] = timeStr.toLowerCase().split(" ");
    let hour = parseInt(hourStr.split(":")[0]);
    const minute = hourStr.includes(":") ? parseInt(hourStr.split(":")[1]) : 0;

    if (modifier === "pm" && hour < 12) hour += 12;
    if (modifier === "am" && hour === 12) hour = 0;

    date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute
    );
  }

  // Save to DB
  const newReminder = await Reminder.create({
    userId,
    message,
    time: date,
  });

  console.log("✅ Reminder saved in DB:", newReminder);

  // Schedule notification
  schedule.scheduleJob(date, async () => {
    io.to(userId).emit("notify", {
      title: "🔔 Reminder",
      body: message,
    });

    console.log(`✅ Reminder triggered: "${message}" for ${userId}`);

    // Delete after triggering
    await Reminder.findByIdAndDelete(newReminder._id);
    console.log(`🗑 Reminder auto-deleted from DB: ${newReminder._id}`);
  });

  return `Reminder set for ${date.toLocaleString()} with message: "${message}"`;
}

module.exports = { ReminderAgent };

const { io } = require("../socket");
const schedule = require("node-schedule");

async function AlarmAgent(userId, info) {
  const { time } = info;

  if (!time) {
    throw new Error("Alarm requires a time.");
  }

  // Parse time safely
  let date = new Date(time);
  if (isNaN(date.getTime())) {
    const now = new Date();
    const [hourStr, modifier] = time.toLowerCase().split(" ");
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

  // Schedule the alarm
  schedule.scheduleJob(date, () => {
    io.to(userId).emit("notify", {
      title: "⏰ Alarm",
      body: "It's time!",
    });
    console.log(`🚨 Alarm triggered for user ${userId} at ${date}`);
  });

  return `Alarm set for ${date.toLocaleString()}`;
}

module.exports = { AlarmAgent };

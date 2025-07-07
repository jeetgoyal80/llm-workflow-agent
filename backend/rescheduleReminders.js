const schedule = require("node-schedule");
const Reminder = require("./models/Reminder");
const { io } = require("./socket"); // ensure socket is ready

function rescheduleReminders() {
  Reminder.find({}).then(reminders => {
    reminders.forEach(reminder => {
      const date = new Date(reminder.time);

      if (date > new Date()) {
        schedule.scheduleJob(date, async () => {
          io.to(reminder.user.toString()).emit("notify", {
            title: "🔔 Reminder",
            body: reminder.message
          });

          console.log(`✅ Re-triggered reminder for user ${reminder.user}`);
          await Reminder.findByIdAndDelete(reminder._id);
        });
      } else {
        // Clean old stale ones
        Reminder.findByIdAndDelete(reminder._id).then(() => {
          console.log(`🧹 Deleted expired reminder: ${reminder.message}`);
        });
      }
    });
  });
}

module.exports = rescheduleReminders;

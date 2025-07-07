const Reminder = require("../models/Reminder");

const reminder = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id }); 
    console.log(reminders);
    
    return res.json(reminders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
const EditReminder =  async (req, res) => {
  try {
    const { message, time } = req.body;
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { message, time },
      { new: true }
    );
    if (!reminder) return res.status(404).json({ message: "Reminder not found" });
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
 module.exports = {reminder,EditReminder}
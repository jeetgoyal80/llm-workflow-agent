// utils/parseDateTime.js or where your parseCalendarInfo is

const moment = require("moment");

function parseCalendarInfo(info) {
  let { title, date, startTime, endTime, participants } = info;

  // Convert natural language date to standard format
  if (date) {
    const parsedDate = moment(date, [
      "YYYY-MM-DD",
      "D MMMM",
      "dddd", // e.g., "Friday"
      "[this] dddd",
      "[next] dddd",
      "D/M/YYYY",
      "D-MM-YYYY",
    ]);

    if (parsedDate.isValid()) {
      info.date = parsedDate.format("YYYY-MM-DD");
    } else {
      throw new Error(`Invalid date: ${date}`);
    }
  }

  // Convert "5 PM" to "17:00"
  if (startTime && startTime.toLowerCase().includes("am") || startTime.toLowerCase().includes("pm")) {
    const parsedTime = moment(startTime, ["h A", "hh A"]);
    if (parsedTime.isValid()) {
      info.startTime = parsedTime.format("HH:mm");
    }
  }

  // Default 1-hour meeting
  if (!endTime && info.startTime) {
    const [h, m] = info.startTime.split(":").map(Number);
    const end = new Date(2000, 0, 1, h, m);
    end.setMinutes(end.getMinutes() + 60);
    info.endTime = end.toTimeString().slice(0, 5); // HH:mm
  }

  return info;
}

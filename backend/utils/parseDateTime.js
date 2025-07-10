const moment = require("moment");

function parseCalendarInfo(info) {
  let { title, date, startTime, endTime, participants } = info;

  const currentYear = new Date().getFullYear();

  if (date) {
    let parsedDate;

    // If user didn't include a year, try to add current year
    if (!/\d{4}/.test(date)) {
      // Append current year manually
      parsedDate = moment(`${date} ${currentYear}`, [
        "D MMMM YYYY",     // 5 July 2025
        "MMMM D YYYY",     // July 5 2025
        "dddd YYYY",       // Friday 2025
      ]);

      // If it's in the past, bump year to next year
      if (parsedDate.isValid() && parsedDate.isBefore(moment(), 'day')) {
        parsedDate.add(1, 'year');
      }
    } else {
      // Date includes year explicitly
      parsedDate = moment(date, [
        "YYYY-MM-DD",
        "D MMMM YYYY",
        "MMMM D YYYY",
        "D/M/YYYY",
        "D-MM-YYYY",
      ]);
    }

    if (parsedDate.isValid()) {
      info.date = parsedDate.format("YYYY-MM-DD");
    } else {
      throw new Error(`Invalid date: ${date}`);
    }
  }

  // Convert "5 PM" to "17:00"
  if (startTime && (startTime.toLowerCase().includes("am") || startTime.toLowerCase().includes("pm"))) {
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

module.exports = { parseCalendarInfo };

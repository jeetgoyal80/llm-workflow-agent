const { google } = require("googleapis");
const { createOAuthClient } = require("../utils/google");
const User = require("../models/User");
const { parseDateTime } = require("../utils/parseDateTime");

exports.CalendarAgent = async (userId, info) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // ✅ Fallback parsing if date/time missing
  if ((!info.date || !info.startTime || !info.endTime) && info.time) {
    const parsed = parseDateTime(`${info.date || ""} ${info.time}`);
    if (parsed) {
      info.date = parsed.date;
      info.startTime = parsed.startTime;
      info.endTime = parsed.endTime;
    }
  }

  // ✅ Support summary → title
  if (!info.title && info.summary) {
    info.title = info.summary;
  }

  // ❌ Still missing required fields?
  if (!info.title || !info.date || !info.startTime) {
    throw new Error("Missing required fields: title, date, startTime");
  }

  // ✅ Default endTime to 1 hour after startTime if missing
  if (!info.endTime) {
    const [h, m] = info.startTime.split(":").map(Number);
    const end = new Date(2000, 0, 1, h, m);
    end.setMinutes(end.getMinutes() + 60);
    info.endTime = end.toTimeString().slice(0, 5); // HH:mm
  }

  // 🔑 Auth
  const oauth2Client = createOAuthClient(user.google);
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  // 🗓️ Event object with Google Meet support
  const event = {
    summary: info.title,
    start: {
      dateTime: `${info.date}T${info.startTime}:00+05:30`,
      timeZone: user.timezone || "Asia/Kolkata",
    },
    end: {
      dateTime: `${info.date}T${info.endTime}:00+05:30`,
      timeZone: user.timezone || "Asia/Kolkata",
    },
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}`, // unique ID
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    },
  };

  // 📅 Insert event and generate Meet link
  const result = await calendar.events.insert({
    calendarId: "primary",
    resource: event,
    conferenceDataVersion: 1, // Important for Meet link
  });

  const htmlLink = result?.data?.htmlLink;
  const meetLink = result?.data?.conferenceData?.entryPoints?.find(
    ep => ep.entryPointType === "video"
  )?.uri;

  // ✅ Return links for further use (e.g., email)
  return {
    message: `📅 Event "**${info.title}**" added to your Google Calendar!`,
    eventLink: htmlLink,
    meetLink: meetLink || null,
  };
};

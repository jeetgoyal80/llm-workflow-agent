const { google } = require("googleapis");
const User = require("../models/User");
const { createOAuthClient } = require("../utils/google");

// 👉 STEP 1: Redirect user to Google's consent screen
// controllers/googleController.js
exports.googleAuth = (req, res) => {
  if (!req.user) return res.status(401).send("Login first");

  const oAuth2Client = createOAuthClient();

  // 🔧 Fix: Pass user ID in state
 const state = JSON.stringify({ userId: req.user._id.toString() });

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
   scope: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events"
  ],
    state,
  });

  res.json({ redirectUrl: authUrl });
};


// 👉 STEP 2: Google redirects back with "code" (callback URL)
exports.callback = async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state) return res.status(400).send("Missing code or state");

  let userId;
  try {
    const parsedState = JSON.parse(state);
    userId = parsedState.userId;
    if (!userId) throw new Error("Missing userId in state");
  } catch (e) {
    return res.status(400).send("Invalid state or userId");
  }

  const oAuth2Client = createOAuthClient();

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // ✅ Save to your user model
    await User.findByIdAndUpdate(
      userId,
      {
        google: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expiry_date: tokens.expiry_date,
        },
      },
      { new: true }
    );

    return res.redirect("http://localhost:5173/app");
  } catch (err) {
    console.error("OAuth error:", err);
    return res.status(500).send("OAuth failed");
  }
};


// 👉 STEP 3: Create calendar event
exports.createEvents = async (req, res) => {
  const { summary, date, startTime, endTime } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.google?.access_token) {
      return res.status(401).json({ error: "Google Calendar not connected." });
    }

    const oAuth2Client = createOAuthClient();
    oAuth2Client.setCredentials({
      access_token: user.google.access_token,
      refresh_token: user.google.refresh_token,
      expiry_date: user.google.expiry_date,
    });

    // Refresh token if expired
    if (user.google.expiry_date < Date.now()) {
      const { credentials } = await oAuth2Client.refreshAccessToken();
      user.google.access_token = credentials.access_token;
      user.google.expiry_date = credentials.expiry_date;
      await user.save();
      oAuth2Client.setCredentials(credentials);
    }

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    const event = {
      summary,
      start: { dateTime: `${date}T${startTime}:00+05:30` },
      end: { dateTime: `${date}T${endTime}:00+05:30` },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    res.json({
      message: "Event created!",
      link: response.data.htmlLink,
    });

  } catch (err) {
    console.error("Calendar Error:", err);
    res.status(500).send("Something went wrong");
  }
};

// utils/google.js
const { google } = require("googleapis");

exports.createOAuthClient = (googleData) => {
  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI = "http://localhost:4000",
  } = process.env;

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );

  if (!googleData?.access_token || !googleData?.refresh_token) {
    throw new Error("Missing Google access or refresh token.");
  }

  oauth2Client.setCredentials({
    access_token: googleData.access_token,
    refresh_token: googleData.refresh_token,
    expiry_date: googleData.expiry_date,
  });

  return oauth2Client;
};

// middlewares/googleAuth.js
const User = require("../models/User");
const { createOAuthClient } = require("../utils/google");

const googleAuth = async (req, res, next) => {
  const userId = req.user?._id; // from JWT middleware

  const user = await User.findById(userId);
  if (!user || !user.google?.access_token)
    return res.status(401).json({ message: "Google auth required" });

  const client = createOAuthClient();
  client.setCredentials({
    access_token: user.google.access_token,
    refresh_token: user.google.refresh_token,
    expiry_date: user.google.expiry_date
  });

  req.googleClient = client;
  next();
};

module.exports = googleAuth;

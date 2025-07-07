const jwt = require("jsonwebtoken");
const User = require("../models/User"); // ✅ add this

async function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch full user from DB
    const user = await User.findById(decoded.id || decoded._id);
    if (!user) return res.sendStatus(401);

    req.user = user; // ✅ Attach full user to request
    next();
  } catch {
    return res.sendStatus(403);
  }
}

module.exports = auth;

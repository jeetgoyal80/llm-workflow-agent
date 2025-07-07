// routes/google.js
const express = require("express");
const router = express.Router();
const googleCtrl = require("../controllers/google");
const requireLogin = require("../middlewares/authmiddleware");
const googleAuth = require("../middlewares/googleaut");

router.get("/auth", requireLogin, googleCtrl.googleAuth);
router.get("/callback",googleCtrl.callback);
router.post("/create-event", requireLogin, googleAuth, googleCtrl.createEvents);

module.exports = router;

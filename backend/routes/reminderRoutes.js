const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authmiddleware");
const { reminder, EditReminder } = require("../controllers/reminder");

// GET reminders for a user
router.get("/",auth,reminder );

// PUT update a reminder
router.put("/:id",auth,EditReminder);

module.exports = router;

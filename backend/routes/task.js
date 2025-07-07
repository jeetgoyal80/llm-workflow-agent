const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authmiddleware");
const { Task, ping } = require("../controllers/task");

router.post("/task", auth, Task); 
router.get("/ping",ping) // ✅ Correct route setup

module.exports = router;

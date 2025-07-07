const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat");
const auth = require("../middlewares/authmiddleware");

router.post("/create", auth, chatController.createChat);
router.post("/:chatId/message", auth, chatController.addMessage);
router.get("/:chatId", auth, chatController.getMessages);
router.get("/", auth, chatController.getChats);
router.patch("/:id/title", auth, chatController.updateChatTitle);

module.exports = router;

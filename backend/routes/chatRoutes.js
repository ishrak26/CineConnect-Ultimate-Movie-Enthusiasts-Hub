const express = require("express");
const chatController = require("../controllers/chatController.js");

const router = express.Router();

// Get users with whom the current user has chatted
router.get("/users", chatController.getChatUsers);

// Get all the chats with a specific user
router.get("/:userId", chatController.getChats);

// Send a message to a user
router.post("/send/:userId", chatController.sendMessage);

module.exports = router;

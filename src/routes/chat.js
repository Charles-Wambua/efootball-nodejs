const express = require("express");
const router = express.Router();
const { Chat, Conversation, User } = require("../schemas/chatSchema");

// Get all conversations for a user
router.get("/conversations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await Conversation.find({ participants: userId })
      .populate("participants", "username")
      .exec();
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all messages for a conversation
router.get("/messages/:conversationId", async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Chat.find({ conversationId })
      .populate("senderId", "username")
      .exec();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create a new conversation
router.post("/conversations", async (req, res) => {
  try {
    const { participants } = req.body;
    const conversation = await Conversation.create({ participants });
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create a new message
router.post("/messages", async (req, res) => {
  try {
    const { conversationId, senderId, content } = req.body;
    const message = await Chat.create({ conversationId, senderId, content });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

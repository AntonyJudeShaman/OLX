const express = require("express");
const router = express.Router();
const Chat = require("../models/chat");

router.get("/:itemId/:buyerId/:sellerId", async (req, res) => {
  const { itemId, buyerId, sellerId } = req.params;
  try {
    const chat = await Chat.findOne({ itemId, buyerId, sellerId });
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.json(chat.messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { itemId, buyerId, sellerId, senderId, message } = req.body;
  try {
    let chat = await Chat.findOne({ itemId, buyerId, sellerId });
    if (!chat) {
      chat = new Chat({ itemId, buyerId, sellerId, messages: [] });
    }
    chat.messages.push({ senderId, message });
    await chat.save();
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/user/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const chats = await Chat.find({
      $or: [{ buyerId: uid }, { sellerId: uid }],
    });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

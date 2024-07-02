const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');

// Get all chat messages for a specific item and users
router.get('/messages/:itemId/:user1/:user2', async (req, res) => {
  try {
    const { itemId, user1, user2 } = req.params;
    const messages = await ChatMessage.find({
      itemId,
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new chat message
router.post('/messages', async (req, res) => {
  try {
    const { sender, receiver, itemId, message } = req.body;
    if (!sender || !receiver || !itemId || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const chatMessage = new ChatMessage({ sender, receiver, itemId, message });
    await chatMessage.save();
    res.status(201).json(chatMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// The like, dislike, unlike, and undislike routes remain the same

module.exports = router;


// Delete a chat message
router.delete('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await ChatMessage.findByIdAndDelete(id);
    res.status(200).json({ message: 'Message deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Like a chat message
router.post('/messages/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ChatMessage.findById(id);
    message.likes += 1;
    await message.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Dislike a chat message
router.post('/messages/:id/dislike', async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ChatMessage.findById(id);
    message.dislikes += 1;
    await message.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Unlike a chat message (remove a like)
router.post('/messages/:id/unlike', async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ChatMessage.findById(id);
    if (message.likes > 0) {
      message.likes -= 1;
    }
    await message.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Undislike a chat message (remove a dislike)
router.post('/messages/:id/undislike', async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ChatMessage.findById(id);
    if (message.dislikes > 0) {
      message.dislikes -= 1;
    }
    await message.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
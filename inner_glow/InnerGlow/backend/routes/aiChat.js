const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ChatMessage = require('../models/ChatMessage');

// AI chat controller using ChatMessage schema
const aiChatController = {
  sendMessage: async (req, res) => {
    try {
      // Save user message
      const userMessage = new ChatMessage({
        user: req.user._id, // assuming protect middleware sets req.user
        message: req.body.message
      });
      await userMessage.save();

      // Here you would call your AI logic and save AI response if needed
      // For now, just echo back
      const aiResponse = "This is a placeholder response from the AI chat system.";

      res.json({
        userMessage,
        aiResponse
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  getChatHistory: async (req, res) => {
    try {
      const history = await ChatMessage.find({ user: req.user._id }).sort({ createdAt: 1 });
      res.json({ history });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getChatStats: async (req, res) => {
    try {
      const totalMessages = await ChatMessage.countDocuments({ user: req.user._id });
      // You can add more stats as needed
      res.json({
        stats: {
          totalMessages,
          totalSessions: 1, // Placeholder
          averageSentiment: 0 // Placeholder
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

// All routes are protected
router.post('/message', protect, aiChatController.sendMessage);
router.get('/history', protect, aiChatController.getChatHistory);
router.get('/stats', protect, aiChatController.getChatStats);

module.exports = router;

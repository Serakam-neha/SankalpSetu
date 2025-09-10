const ChatMessage = require('../models/ChatMessage');

exports.createMessage = async (req, res) => {
  try {
    const message = new ChatMessage({
      user: req.body.user,
      message: req.body.message
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find().populate('user').sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
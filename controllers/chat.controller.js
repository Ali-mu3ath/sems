const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// Get or create conversation for user
exports.getConversation = async (req, res) => {
  try {
    let convo = await Conversation.findOne({ user: req.user.id, status: "open" });
    if (!convo) {
      convo = await Conversation.create({ user: req.user.id });
    }
    res.json(convo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    const msg = await Message.create({
      conversation: conversationId,
      sender: req.user.id,
      text
    });

    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Edit message
exports.editMessage = async (req, res) => {
  try {
    const message = await Message.findOneAndUpdate(
      { _id: req.params.id, sender: req.user.id },
      { text: req.body.text, edited: true },
      { new: true }
    );

    if (!message) return res.status(404).json({ message: "Message not found or not yours" });

    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const deleted = await Message.findOneAndDelete({
      _id: req.params.id,
      sender: req.user.id
    });

    if (!deleted) return res.status(404).json({ message: "Message not found or not yours" });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Close conversation
exports.closeConversation = async (req, res) => {
  try {
    const convo = await Conversation.findOneAndUpdate(
      { _id: req.body.id, user: req.user.id },
      { status: "closed" },
      { new: true }
    );

    if (!convo) return res.status(404).json({ message: "Conversation not found" });

    res.json(convo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get messages list
exports.getMessages = async (req, res) => {
  try {
    const msgs = await Message.find({ conversation: req.query.id })
      .sort({ createdAt: 1 });

    res.json(msgs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

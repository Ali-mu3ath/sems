const Conversation = require("../models/conversation");
const Message = require("../models/message");

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

    // 👇 حدد دور المرسل
    const senderRole = req.user.role === 'admin' ? 'admin' : 'user';

    const msg = await Message.create({
      conversation: conversationId,
      sender: req.user.id,
      senderRole, // 👈 مهم!
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
    const filter = req.user.role === 'admin'
      ? { _id: req.body.id } // Admin can close any
      : { _id: req.body.id, user: req.user.id }; // User can close only theirs

    const convo = await Conversation.findOneAndUpdate(
      filter,
      { status: "closed", closedAt: new Date() },
      { new: true }
    );

    if (!convo) return res.status(404).json({ message: "Conversation not found or access denied" });

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

// 👇 GET: عرض جميع المحادثات المفتوحة (للـ Admin فقط)
exports.getOpenConversations = async (req, res) => {
  try {
    // تأكد أن المستخدم admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    // جلب كل المحادثات المفتوحة + معلومات المستخدم
    const conversations = await Conversation
      .find({ status: 'open' })
      .populate('user', 'name email') // جلب اسم وبريد المستخدم
      .sort({ updatedAt: -1 }); // آخر محادثة تم تحديثها

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👇 POST: إرسال رسالة من الـ Admin
exports.sendAdminMessage = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const { conversationId, text } = req.body;

    // التحقق من وجود conversationId
    if (!conversationId || !text) {
      return res.status(400).json({ message: "conversationId and text are required" });
    }

    const msg = await Message.create({
      conversation: conversationId,
      sender: req.user.id,
      senderRole: 'admin',
      text
    });

    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
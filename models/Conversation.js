const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
  closedAt: { type: Date, default: null }
});

module.exports = mongoose.model('Conversation', conversationSchema);

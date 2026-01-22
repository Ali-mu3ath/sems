const mongoose = require('mongoose');

const meterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  meterId: { type: String, required: true, unique: true },
  name: { type: String, default: 'Main Meter' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meter', meterSchema);

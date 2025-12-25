const mongoose = require('mongoose');

const aiResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  meterId: {
    type: String,
    required: true
  },

  consumption: {
    type: Number,
    required: true
  },

  anomaly_score: {
    type: Number,
    required: true
  },

  is_anomaly: {
    type: Boolean,
    required: true
  },

  model_type: {
    type: String,
    default: 'mock-anomaly-v1'
  },

  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AIResult', aiResultSchema);

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

  forecast: [Number],

  predicted_bill: Number,

  anomalies: [
    {
      timestamp: Date,
      value: Number,
      reason: String 
    }
  ],

  recommendations: [String],

  type: {
    type: String,
    enum: ['prediction', 'anomaly'],
    required: true
  },

  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AIResult', aiResultSchema);

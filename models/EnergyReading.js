const mongoose = require('mongoose');

const energyReadingSchema = new mongoose.Schema({
  meterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meter',
    required: true
  },
  consumption: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('EnergyReading', energyReadingSchema);

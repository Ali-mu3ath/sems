const mongoose = require('mongoose');

module.exports = mongoose.model(
  'EnergyReading',
  new mongoose.Schema({
    LCLid: String,
    tstp: Date,
    energy_kwh: Number
  })
);
 
const mongoose = require('mongoose');

module.exports = mongoose.model(
  'Household',
  new mongoose.Schema({
    LCLid: String,
    region: String,
    tariff_type: String
  })
);

const EnergyReading = require('../models/EnergyReading');

exports.addReading = async (req, res) => {
  res.json(await EnergyReading.create(req.body));
};

exports.latest = async (req, res) => {
  res.json(
    await EnergyReading.findOne({ LCLid: req.params.id }).sort({ tstp: -1 })
  );
};

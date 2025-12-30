const Meter = require('../models/meter');
const EnergyReading = require('../models/EnergyReading');

// إضافة عداد
exports.createMeter = async (req, res) => {
  try {
    const meter = await Meter.create({
      user: req.user.id,
      name: req.body.name
    });

    res.json(meter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// جلب عدادات المستخدم
exports.getMeters = async (req, res) => {
  const meters = await Meter.find({ user: req.user.id });
  res.json(meters);
};

// إضافة قراءة
exports.addReading = async (req, res) => {
  console.log(req.body); 

  const reading = await EnergyReading.create({
    meterId: req.body.meterId,
    consumption: req.body.consumption
  });

  res.json(reading);
};


// آخر قراءة
exports.latest = async (req, res) => {
  const reading = await EnergyReading
    .findOne({ meterId: req.params.id })
    .sort({ createdAt: -1 });

  res.json(reading);
};

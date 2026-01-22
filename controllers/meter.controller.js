const Meter = require('../models/meter');
const EnergyReading = require('../models/EnergyReading');

// إضافة عداد
exports.createMeter = async (req, res) => {
  try {
    const { meterId, name } = req.body;

    if (!meterId) {
      return res.status(400).json({ message: "meterId is required" });
    }

    // التحقق إذا المستخدم حاول يكرر نفس meterId
    const exists = await Meter.findOne({ meterId });
    if (exists) {
      return res.status(409).json({ message: "Meter ID already exists" });
    }

    const meter = await Meter.create({
      user: req.user.id,
      meterId,
      name
    });

    res.status(201).json(meter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// جلب عدادات المستخدم
exports.getMeters = async (req, res) => {
  try {
    const meters = await Meter.find({ user: req.user.id });
    res.json(meters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// إضافة قراءة جديدة
exports.addReading = async (req, res) => {
  try {
    const { meterId, consumption } = req.body;

    if (!meterId || !consumption) {
      return res.status(400).json({ message: "meterId and consumption are required" });
    }

    const meter = await Meter.findOne({ meterId, user: req.user.id });
    if (!meter) {
      return res.status(404).json({ message: "Meter not found" });
    }

    const reading = await EnergyReading.create({
      meterId,
      consumption
    });

    res.status(201).json(reading);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// آخر قراءة حسب meterId
exports.latest = async (req, res) => {
  try {
    const meterId = req.params.meterId;

    if (!meterId) {
      return res.status(400).json({ message: "meterId is required" });
    }

    const reading = await EnergyReading
      .findOne({ meterId })
      .sort({ createdAt: -1 });

    if (!reading) {
      return res.status(404).json({ message: "No readings found" });
    }

    res.json(reading);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// تعديل بيانات عداد
exports.updateMeter = async (req, res) => {
  try {
    const { meterId } = req.params;
    const { name } = req.body;

    const meter = await Meter.findOne({ meterId, user: req.user.id });
    if (!meter) return res.status(404).json({ message: "Meter not found" });

    if (name) meter.name = name;

    await meter.save();
    res.json({ message: "Meter updated", meter });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// حذف عداد
exports.deleteMeter = async (req, res) => {
  try {
    const { meterId } = req.params;

    const meter = await Meter.findOneAndDelete({ meterId, user: req.user.id });
    if (!meter) return res.status(404).json({ message: "Meter not found" });

    // احذف القراءات المرتبطة بالعداد (اختياري)
    await EnergyReading.deleteMany({ meterId });

    res.json({ message: "Meter deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


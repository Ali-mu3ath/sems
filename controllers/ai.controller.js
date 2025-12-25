const AIResult = require('../models/AIResult');
const aiService = require('../services/ai.service');

const detectAnomaly = async (req, res) => {
  try {
    const { meterId, consumption } = req.body;

    if (!meterId || consumption === undefined) {
      return res.status(400).json({ message: 'Missing data' });
    }

    const result = aiService.detectAnomaly(consumption);

    const saved = await AIResult.create({
      user: req.user.id,
      meterId,
      consumption,
      anomaly_score: result.anomaly_score,
      is_anomaly: result.is_anomaly
    });

    res.json({
      message: 'Anomaly analysis completed',
      data: saved
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAnomalyHistory = async (req, res) => {
  try {
    const results = await AIResult.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      count: results.length,
      data: results
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  detectAnomaly,
  getAnomalyHistory
};


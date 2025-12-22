const AIResult = require('../models/AIResult');

exports.predictBill = async (req, res) => {
  try {
    const { meterId } = req.body;

    const result = {
      forecast: [0.2, 0.3, 0.4],
      predicted_bill: 6.1,
      anomalies: [],
      recommendations: ['Reduce usage 18:00–20:00']
    };

    const saved = await AIResult.create({ 
      user: req.user.id,
      meterId,
      forecast: result.forecast,
      predicted_bill: result.predicted_bill,
      anomalies: result.anomalies,
      recommendations: result.recommendations,
      type: 'prediction'
    });

    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: 'AI Prediction failed' });
  }
};

exports.detectAnomaly = async (req, res) => {
  try {
    const { meterId } = req.body;

    const result = {
      anomalies: []
    };

    const saved = await AIResult.create({
      user: req.user.id,
      meterId,
      anomalies: result.anomalies,
      type: 'anomaly'
    });

    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Anomaly detection failed' });
  }
};

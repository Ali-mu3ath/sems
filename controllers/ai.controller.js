const AIResult = require('../models/AIResult');
const aiService = require('../services/ai.service');
const EnergyReading = require('../models/EnergyReading');

const detectAnomaly = async (req, res) => {
  try {
    const { meterId, consumption } = req.body;

    if (!meterId || consumption === undefined) {
      return res.status(400).json({ message: 'Missing data' });
    }

    //  كشف الشذوذ
    const anomalyResult = aiService.detectAnomaly(consumption);

    //  توليد النصايح (هون كانت ناقصة)
    const recommendations = aiService.getRecommendations(
      consumption,
      anomalyResult.is_anomaly
    );

    //  تخزين النتيجة
    const saved = await AIResult.create({
      user: req.user.id,
      meterId,
      consumption,
      anomaly_score: anomalyResult.anomaly_score,
      is_anomaly: anomalyResult.is_anomaly
    });

    //  الرد للفرونت
    res.json({
      message: 'Anomaly analysis completed',
      anomaly: anomalyResult,
      recommendations,   //  هون بتطلع النصايح
      data: saved
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAnomalyHistory = async (req, res) => {
  const results = await AIResult.find({ user: req.user.id });
  res.json(results);
};

//  هذا لازم يكون موجود
const predictBill = async (req, res) => {
  try {
    const { meterId } = req.body;

    if (!meterId) {
      return res.status(400).json({ message: 'meterId required' });
    }

    const readings = await EnergyReading.find({ meterId });

    if (readings.length === 0) {
      return res.json({
        totalConsumption: 0,
        predictedBill: 0,
        message: 'No readings yet'
      });
    }

    const values = readings.map(r => r.consumption);
    const result = aiService.predictBill(values);

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  detectAnomaly,
  getAnomalyHistory,
  predictBill   
};

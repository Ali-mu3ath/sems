/**
 *  كشف الشذوذ (Anomaly Detection)
 * منطق بسيط مؤقت – لاحقًا يستبدل بنموذج AI حقيقي
 */
function detectAnomaly(consumption) {
  const threshold = 10; // kWh
  const anomaly_score = +(consumption / 20).toFixed(2);

  return {
    anomaly_score,
    is_anomaly: consumption > threshold
  };
}

/**
 *  توقع الفاتورة
 */
function predictBill(consumptions = []) {
  if (!Array.isArray(consumptions) || consumptions.length === 0) {
    return {
      totalConsumption: 0,
      predictedBill: 0
    };
  }

  const totalConsumption = +consumptions
    .reduce((sum, v) => sum + v, 0)
    .toFixed(2);

  const ratePerKwh = 0.22; // سعر افتراضي

  return {
    totalConsumption,
    predictedBill: +(totalConsumption * ratePerKwh).toFixed(2)
  };
}

/**
 *  توقع الاستهلاك القادم (forecast)
 */
function predictConsumption(consumptions = []) {
  if (consumptions.length === 0) {
    return { forecast: [] };
  }

  const last = consumptions[consumptions.length - 1];

  return {
    forecast: [
      +(last * 1.05).toFixed(2),
      +(last * 1.10).toFixed(2),
      +(last * 1.15).toFixed(2)
    ]
  };
}

/**
 *  توليد نصائح توفير بناءً على الاستهلاك
 */
function getRecommendations(consumption, isAnomaly) {
  const tips = [];

  if (isAnomaly) {
    tips.push('Unusual consumption detected. Check running appliances.');
  }

  if (consumption > 20) {
    tips.push('Consider using energy-efficient appliances.');
  }

  if (consumption > 10) {
    tips.push('Reduce usage during peak hours (18:00–22:00).');
  }

  if (tips.length === 0) {
    tips.push('Your energy usage is within the normal range 👍');
  }

  return tips;
}

module.exports = {
  detectAnomaly,
  predictBill,
  predictConsumption,
  getRecommendations
};

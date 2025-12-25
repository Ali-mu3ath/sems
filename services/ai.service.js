// services/ai.service.js
function detectAnomaly(consumption) {
  // Mock logic (مؤقت)
  const threshold = 5; // kWh
  const anomaly_score = consumption / 10;

  return {
    anomaly_score,
    is_anomaly: consumption > threshold
  };
}

module.exports = {
  detectAnomaly
};

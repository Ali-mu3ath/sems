exports.callAI = async (payload) => {
  // MOCK – فقط هذا الملف سيتغير لاحقاً
  return {
    LCLid: payload.LCLid,
    forecast: [0.2, 0.3, 0.4],
    predicted_bill: 6.1,
    anomalies: [],
    recommendations: ['Reduce usage 18:00–20:00']
  };
};

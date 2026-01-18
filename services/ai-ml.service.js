const axios = require("axios");

// 5000
async function callAICoreForecast(values) {
  try {
    const response = await axios.post("http://localhost:5000/predict", { values });
    return response.data;
  } catch (err) {
    console.error("AI Core Forecast (5000) Error:", err.response?.data || err.message);
    throw new Error("فشل في توقع الاستهلاك (النموذج الأساسي)");
  }
}

// 6000
async function callAICoreAnomalyForecast(lclid, window) {
  try {
    const response = await axios.post("http://localhost:6000/predict", {
      lclid,
      window
    });
    return response.data;
  } catch (err) {
    console.error("AI Core (6000) Error:", err.response?.data || err.message);
    throw new Error("فشل في تحليل الاستهلاك والتنبؤ بالذروة");
  }
}

//7000
async function callAICoreAnomalyDetection(lclid, consumption_values) {
  try {
    const response = await axios.post("http://localhost:7000/detect_anomaly", {
      lclid,
      consumption_values
    });
    return response.data;
  } catch (err) {
    console.error("AI Core (7000) Error:", err.response?.data || err.message);
    throw new Error("فشل في كشف الشذوذ");
  }
}

//5001
async function callAICoreForecastNewHomes(lclid) {
  try {
    const response = await axios.post("http://localhost:5001/predict", {
      lclid
    });
    return response.data;
  } catch (err) {
    console.error("AI Core (5001) Error:", err.response?.data || err.message);
    throw new Error("فشل في توقع الاستهلاك للعداد الجديد");
  }
}

//6001
async function callAICoreForecast6001(lclid) {
  try {
    const response = await axios.post("http://localhost:6001/predict", {
      lclid: lclid
    });
    return response.data;
  } catch (err) {
    console.error("AI Core (6001) Error:", err.response?.data || err.message);
    throw new Error("فشل في تحليل الاستهلاك من النموذج الجديد");
  }
}


module.exports = {
  callAICoreForecast,
  callAICoreAnomalyForecast,
  callAICoreAnomalyDetection,
  callAICoreForecastNewHomes,
  callAICoreForecast6001  
};
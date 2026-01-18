const axios = require('axios');
const { 
  callAICoreForecast,
  callAICoreAnomalyForecast,
  callAICoreAnomalyDetection,   
  callAICoreForecastNewHomes,
  callAICoreForecast6001
} = require("../services/ai-ml.service");

// 5000
const forecastFromAI = async (req, res) => {
  try {
    const { lclid, values } = req.body;

    if (!lclid && !values) {
      return res.status(400).json({ message: "lclid or values required" });
    }
    const response = await axios.post("http://127.0.0.1:5000/predict", {
      lclid,
      values
    });

    return res.json({
      message: "AI forecast success",
      data: response.data
    });

  } catch (error) {
    console.error("AI ERROR (5000):", error.message);
    return res.status(500).json({
      message: "AI forecast failed",
      error: error.message
    });
  }
};


//5001
const forecastNewHomes = async (req, res) => {
  try {
    const { lclid } = req.body;

    if (!lclid) {
      return res.status(400).json({ message: "lclid is required" });
    }

    const aiResult = await callAICoreForecastNewHomes(lclid);

    return res.json({
      success: true,
       aiResult
    });

  } catch (error) {
    console.error("Forecast New Homes Error (5001):", error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 6000
const anomalyForecast = async (req, res) => {
  try {
    const { lclid, window } = req.body;

    if (!lclid || !window) {
      return res.status(400).json({ message: "lclid and window are required" });
    }

    if (!Array.isArray(window) || window.length !== 14) {
      return res.status(400).json({ message: "Window must be an array of 14 rows" });
    }

    if (!window.every(row => Array.isArray(row) && row.length === 4)) {
      return res.status(400).json({ message: "Each row in window must have 4 numbers" });
    }

    const aiResult = await callAICoreAnomalyForecast(lclid, window);

    return res.json({
      success: true,
       aiResult
    });

  } catch (error) {
    console.error("Anomaly Forecast Error (6000):", error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//7000
const detectAnomalyCore7000 = async (req, res) => {
  try {
    const { lclid, consumption_values } = req.body;

    if (!lclid || !consumption_values) {
      return res.status(400).json({ message: "lclid and consumption_values are required" });
    }

    if (!Array.isArray(consumption_values) || consumption_values.length !== 12) {
      return res.status(400).json({ message: "consumption_values must be an array of 12 numbers" });
    }

    const aiResult = await callAICoreAnomalyDetection(lclid, consumption_values);

    return res.json({
      success: true,
       aiResult
    });

  } catch (error) {
    console.error("Anomaly Detection (7000) Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 6001
const forecastFrom6001 = async (req, res) => {
  try {
    const { lclid } = req.body;

    if (!lclid) {
      return res.status(400).json({ message: "lclid is required" });
    }

    const aiResult = await callAICoreForecast6001(lclid);

    return res.json({
      success: true,
       aiResult
    });

  } catch (error) {
    console.error("Forecast (6001) Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  forecastFromAI,
  forecastNewHomes,
  anomalyForecast,
  detectAnomalyCore7000,
   forecastFrom6001 
};
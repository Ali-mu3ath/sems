
const express = require("express");
const router = express.Router();
const aiController = require("../controllers/ai.controller");

router.post("/forecast", aiController.forecastFromAI);         
router.post("/forecast-new", aiController.forecastNewHomes);
router.post("/anomaly-forecast", aiController.anomalyForecast); 
router.post("/anomaly-detect", aiController.detectAnomalyCore7000);
router.post("/forecast-6001", aiController.forecastFrom6001);

module.exports = router;
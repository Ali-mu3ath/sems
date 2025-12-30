const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const auth = require('../middleware/auth.middleware');

router.post('/anomaly', auth, aiController.detectAnomaly);
router.get('/history', auth, aiController.getAnomalyHistory);
router.post('/predict-bill', auth, aiController.predictBill);

module.exports = router;

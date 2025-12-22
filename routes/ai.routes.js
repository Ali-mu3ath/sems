const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.middleware');
const aiController = require('../controllers/ai.controller');

router.post('/predict-bill', auth, aiController.predictBill);
router.post('/anomaly', auth, aiController.detectAnomaly);

router.get('/results', auth, async (req, res) => {
  const results = await require('../models/AIResult').find({
    user: req.user.id
  }).sort({ created_at: -1 });

  res.json(results);
});
 

module.exports = router;

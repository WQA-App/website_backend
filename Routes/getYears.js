const express = require('express');
const router = express.Router();
const wqiWaterParamaters = require('../models/wqiWaterParamaters');

router.get('/', async (req, res) => {
  try {
    const years = await wqiWaterParamaters.distinct('year', {
      latitude: { $ne: null },
      longitude: { $ne: null }
    });

    res.json(years.sort());
  } catch (err) {
    console.error('Error fetching years:', err);
    res.status(500).send('Database error');
  }
});

module.exports = router;

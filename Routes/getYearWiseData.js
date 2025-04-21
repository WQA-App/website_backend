const express = require('express');
const router = express.Router();
const wqiWaterParamaters = require('../models/wqiWaterParamaters'); // adjust path if needed

router.post('/', async (req, res) => {
//   const { year } = req.params;
// console.log('getting yearwise data');
  // console.log(req.body);
 const year = Number(req.body.year);
//  console.log(year);

  if (isNaN(year)) {
    return res.status(400).json({ error: 'Invalid year provided' });
  }

  try {
    const results = await wqiWaterParamaters.find({
      year: parseInt(year),
      latitude: { $ne: null },
      longitude: { $ne: null }
    }).lean(); // lean() for faster, plain JS objects

    console.log(results.length);
    res.json(results);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Database error');
  }
});

module.exports = router;

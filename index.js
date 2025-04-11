const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const PORT = 3000;

app.use(cors());

app.get('/api/years', (req, res) => {
  console.log("Reached backend");
  const year = req.params.year;
  const tableName = `water_quality_data_${year}`;

  const query = `SELECT * FROM ${tableName} WHERE latitude IS NOT NULL AND longitude IS NOT NULL`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);   
      return res.status(500).send('Database error');
    }
    res.json(results);
  });
});

// Get data for a given year
app.get('/api/data/:year', (req, res) => {
  const { year } = req.params;
  const table = `water_quality_data_${year}`;

  const query = `SELECT * FROM \`${table}\` WHERE latitude IS NOT NULL AND longitude IS NOT NULL`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('Error');
    }
    res.json(results);
  });
});

app.get("/",(req,res)=>{
    res.send("I am working")
})

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});

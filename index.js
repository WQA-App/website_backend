const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const addYearlyData = require('./Routes/addYearlyData.js');
const getYears = require('./Routes/getYears.js')
const getYearWiseData = require('./Routes/getYearWiseData.js')
const bodyParser = require('body-parser')
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

connectDB();
app.use(express.json());
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())

// parse application/json
app.use(bodyParser.json())

//Save excel file in database
app.use('/api', addYearlyData);

//Get all years
app.use('/api/years',getYears);

// Get data for a given year
app.use('/api/data',getYearWiseData)

// app.get("/",(req,res)=>{
//     res.send("I am working")
// })

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});

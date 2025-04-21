const mongoose = require('mongoose');

const wqiWaterParamatersSchema = new mongoose.Schema({
  well_id: String,
  s_no: Number,
  state: String,
  district: String,
  block: String,
  village: String,
  latitude: Number,
  longitude: Number,
  year: Number,
  ph: Number,
  electrical_conductivity: Number,
  CO3: Number,
  HCO3: Number,
  Cl: Number,
  SO4: Number,
  NO3: Number,
  PO4: Number,
  TH: Number,
  Ca: Number,
  Mg: Number,
  Na: Number,
  K: Number,
  F: Number,
  TDS: Number,
  SiO2: Number,
  water_quality_index: Number
}, {
  collection: 'CGWB_data'
});

module.exports = mongoose.model('wqiWaterParamaters', wqiWaterParamatersSchema);
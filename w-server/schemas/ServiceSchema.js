const mongoose = require('mongoose');

const ServiceSchema = mongoose.Schema({
  type: Number, //0 - Robo-advisor, 1 - Discretionary, 2 - Advisory
  exit_fee: Number,
  managment_fee: Number,
  perfomance_fee: Number,
  font_fee: Number,
  recalculation: Number, // - in days
  min: Number, // in dollars
  metodology: String,
  philosofy: String  
});

module.exports = ServiceSchema;
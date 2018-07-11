const mongoose = require('mongoose');

const stockTableSchema = mongoose.Schema({
  title: String,
  adress: String,
  last_price: String,
  change_percnt: String,
  high_price: String,
  low_price: String,
  volume: String
});

module.exports = mongoose.model('stockmodels', stockTableSchema);
const mongoose = require('mongoose');

const StockSchema = mongoose.Schema({
  name: String,
  title: String,
  adress: String,
  last_price: String,
  change_percnt: String,
  high_price: String,
  low_price: String,
  volume: String,
  token_img: String
});

module.exports = mongoose.model('stocks', StockSchema);
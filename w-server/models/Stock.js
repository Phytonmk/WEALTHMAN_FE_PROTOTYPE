const mongoose = require('mongoose');

const StockSchema = mongoose.Schema({
  name: String,
  title: String,
  address: String,
  last_price: Number,
  change_percnt: Number,
  volume: Number,
  token_img: String,
  last_update: Date,
});

module.exports = mongoose.model('stocks', StockSchema);
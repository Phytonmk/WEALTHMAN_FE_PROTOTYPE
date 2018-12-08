const mongoose = require('mongoose');

const CurrencySchema = mongoose.Schema({
  title: String,
  toEthRate: Number,
  toUsdRate: Number,
  lastUpdate: Date,
});

module.exports = mongoose.model('currensy', CurrencySchema);
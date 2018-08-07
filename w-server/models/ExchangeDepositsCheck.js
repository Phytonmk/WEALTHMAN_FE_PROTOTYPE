const mongoose = require('mongoose');

const ExchangeDepositsCheckSchema = mongoose.Schema({
  date: {type: Date, default: Date.now},
  exchange: String
});

module.exports = mongoose.model('ExchangeDepositsCheck', ExchangeDepositsCheckSchema);
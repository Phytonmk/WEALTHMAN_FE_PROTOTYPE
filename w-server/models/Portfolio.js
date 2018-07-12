const mongoose = require('mongoose');

const PortfolioScheme = mongoose.Schema({
  id: Number,
  request: Number,
  manager: Number,
  smart_contract: String,
  instrument: String,
  fees: Number,
  value: Number,
  status: {type: String, default: 'proposed'},
  cost: Number, 
  currencies: [{
    currency: String,
    percent: Number,
    amount: Number,
    analysis: String,
    comments: String,
  }]
});

module.exports = mongoose.model('Portfolio', PortfolioScheme);
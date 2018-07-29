const mongoose = require('mongoose');

const PortfolioScheme = mongoose.Schema({
  state: {type: String, default: 'draft'}, // active, draft, old
  request: String,
  manager: String,
  investor: String,
  smart_contract: {type: String, default: '-'},
  instrument: {type: String, default: 'not specified'},
  value: {type: Number, default: 0},
  cost: {type: Number, default: 0},
  currency: {type: String, default: 'ETH'},
  date: {type: Date, default: Date.now},
  currencies: [{
    currency: String,
    percent: Number,
    amount: Number,
    analysis: String,
    comments: String,
    address: String,
  }]
});

module.exports = mongoose.model('Portfolio', PortfolioScheme);
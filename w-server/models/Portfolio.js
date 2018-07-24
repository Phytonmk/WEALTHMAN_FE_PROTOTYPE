const mongoose = require('mongoose');

const PortfolioScheme = mongoose.Schema({
  id: Number,
  state: {type: String, default: 'draft'}, // active, draft, old
  request: Number,
  manager: Number,
  investor: Number,
  smart_contract: {type: String, default: '-'},
  instrument: {type: String, default: 'not specified'},
  alg: {type: Number, default: 0},
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
  }]
});

module.exports = mongoose.model('Portfolio', PortfolioScheme);
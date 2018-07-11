const mongoose = require('mongoose');

const PortfolioScheme = mongoose.Schema({
  id: Number,
  request: Number,
  manager: Number,
  currencies: [{
    currency: String,
    percent: Number,
    amount: Number,
    analysis: String,
    comments: String,
  }]
});

module.exports = mongoose.model('Portfolio', PortfolioScheme);
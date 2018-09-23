const mongoose = require('mongoose');

const InvestorStatisticSchema = mongoose.Schema({
  investor: String,
  last_update: Date,
  dates: [Date],
  aum: [Number],
  portfolios: [{
    active: Number,
    archived: Number,
    inProgress: Number
  }],
});

module.exports = mongoose.model('InvestorStatistic', InvestorStatisticSchema);
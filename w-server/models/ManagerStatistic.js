const mongoose = require('mongoose');

const ManagerStatisticSchema = mongoose.Schema({
  manager: String,
  last_update: Date,
  dates: [Date],
  aum: [Number],
  portfolios: [{
    active: Number,
    archived: Number,
    inProgress: Number
  }]
});

module.exports = mongoose.model('ManagerStatistic', ManagerStatisticSchema);
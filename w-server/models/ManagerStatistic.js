const mongoose = require('mongoose');

const ManagerStatisticSchema = mongoose.Schema({
  manager: String,
  lastUpdate: Date,
  dates: [Date],
  aum: [Number],
  portfolios: [{
    active: Number,
    archived: Number,
    inProgress: Number
  }]
});

module.exports = mongoose.model('ManagerStatistic', ManagerStatisticSchema);
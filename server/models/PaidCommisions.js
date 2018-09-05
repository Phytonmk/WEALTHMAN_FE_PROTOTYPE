const mongoose = require('mongoose');

const PaidCommisionsSchema = mongoose.Schema({
  date: {type: Date, default: Date.now},
  manager: String,
  address: String,
  amount: Number
});

module.exports = mongoose.model('PaidCommisions', PaidCommisionsSchema);
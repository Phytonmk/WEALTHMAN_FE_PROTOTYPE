const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  smart_contract: String,
  block: Number,
  index: Number,
  date: Date,
  data: {}
});

module.exports = mongoose.model('transaction', transactionSchema);
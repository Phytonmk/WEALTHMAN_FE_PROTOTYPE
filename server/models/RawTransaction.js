const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
  smart_contract: String,
  request: String,
  block: Number,
  index: Number,
  date: Date,
  data: {}
});

module.exports = mongoose.model('rawTransaction', TransactionSchema);
const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  contract: String,
  request: String,
  date: {type: Date, default: Date.now()},
  type: String,
  receiver: mongoose.Schema({
    name: String,
    type: String,
    id: String
  }),
  ivnestor: String,
  manager: String,
});

module.exports = mongoose.model('transaction', transactionSchema);
const mongoose = require('mongoose');

const ManagerPortfolios = mongoose.Schema({
  type: String,
  id: Number,
  investor: Number,
  manager: Number,
  date: String,
  value: Number,
  currency: String,
  alg: Number,
  profit: Number,
  cost: Number,
  status: String
});
module.exports = mongoose.model('ManagerPortfolios', ManagerPortfolios);
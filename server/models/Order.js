const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
  date: {type: Date, default: Date.now},
  status: {type: String, default: 'buy'}, // 'token bouthg', 'completed', 'failed'
  request: String,
  related_portfolio: String,
  token_name: String,
  whole_eth_amount: Number,
  percent: Number,
  contract_address: String,
  cost: Number,
  quantity: Number,
  rebuild: Boolean,
});

module.exports = mongoose.model('Order', OrderSchema);
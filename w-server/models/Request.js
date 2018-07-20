const mongoose = require('mongoose');

const RequestSchema = mongoose.Schema({
  id: Number,
  type: {type: String, default: 'portfolio'},
  investor: Number,
  manager: Number,
  company: Number,
  date: {type: Date, default: Date.now},
  status: {type: String, default: 'pending'},
  value: Number,
  comment: String,
  options: {
    analysis: Boolean,
    comment: Boolean
  },
  contract_deployment: Date,
  service: String,
  revisions_amount: {type: Number, default: 0},
  revisions: {type: Number, default: 0}
});

module.exports = mongoose.model('Request', RequestSchema);
const mongoose = require('mongoose');

const RequestSchema = mongoose.Schema({
  type: {type: String, default: 'portfolio'},
  investor: String,
  manager: String,
  company: String,
  date: {type: Date, default: Date.now},
  status: {type: String, default: 'pending'},
  value: Number,
  comment: String,
  options: {
    analysis: Boolean,
    comment: Boolean
  },
  end_date: Date,
  period: Number,
  contract_deployment: Date,
  service: String,
  revisions_amount: {type: Number, default: 0},
  revisions: {type: Number, default: 0},
  initiatedByManager: {type: Boolean, default: false},
  deployment_hash: {type: String, default: ''},
  exit_fee: Number,
  managment_fee: Number,
  perfomance_fee: Number,
  front_fee: Number
});

module.exports = mongoose.model('Request', RequestSchema);
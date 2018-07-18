const mongoose = require('mongoose');

const RequestSchema = mongoose.Schema({
  id: Number,
  type: {type: String, default: 'portfolio'},
  investor: Number,
  manager: Number,
  company: Number,
  date: {type: Date, default: Date.now},
  status: {type: String, default: 'waiting'}, // Cancelled Declined, Accepted, Pending, Revision, Recalculated
  value: Number,
  comment: String,
  options: {
    analysis: Boolean,
    comment: Boolean
  },
  contract_deployment: Date,
  service: String
});

module.exports = mongoose.model('Request', RequestSchema);
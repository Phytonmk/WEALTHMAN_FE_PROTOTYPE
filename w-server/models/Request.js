const mongoose = require('mongoose');

const RequestSchema = mongoose.Schema({
  id: Number,
  investor: Number,
  manager: Number,
  date: {type: Date, default: Date.now},
  status: {type: String, default: 'waiting'} // Cancelled Declined, Accepted, Pending, Revision, Recalculated
});

module.exports = mongoose.model('Request', RequestSchema);
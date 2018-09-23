const mongoose = require('mongoose');

const EmailConfirmationSchema = mongoose.Schema({
  date: {type: Date, default: Date.now},
  user: String,
  token: String
});

module.exports = mongoose.model('EmailConfirmation', EmailConfirmationSchema);
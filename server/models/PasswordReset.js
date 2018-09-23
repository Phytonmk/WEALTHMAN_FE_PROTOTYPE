const mongoose = require('mongoose');

const PasswordResetSchema = mongoose.Schema({
  date: {type: Date, default: Date.now},
  user: String,
  email: String,
  code: String,
  used: {type: Boolean, default: false}
});

module.exports = mongoose.model('PasswordReset', PasswordResetSchema);
const mongoose = require('mongoose');

const emailChangingSchema = mongoose.Schema({
  user: String,
  oldEmail: String,
  oldEmailConfirmationToken: String,
  oldEmailConfirmed: Boolean,
  newEmailConfirmationToken: String,
  newEmail: String,
  newEmailConfirmed: Boolean,
});

module.exports = mongoose.model('emailChanging', emailChangingSchema);
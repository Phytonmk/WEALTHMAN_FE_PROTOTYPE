const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  id: Number,
  type: Number,
  login: String,
  password_hash: String,
  agreed: {type: Boolean, default: false},
  last_request: {type: Date, default: Date.now}
});

module.exports = mongoose.model('user', userSchema);
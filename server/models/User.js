const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  type: Number,
  login: String,
  password_hash: String,
  agreed: {type: Boolean, default: false},
  confirmed: {type: Boolean, default: false},
  last_request: {type: Date, default: Date.now},
  invited: String
});

module.exports = mongoose.model('user', userSchema);
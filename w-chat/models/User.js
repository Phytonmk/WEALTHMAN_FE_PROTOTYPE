const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  id: String,
  type: Number,
  login: String,
  password_hash: String,
  agreed: {type: Boolean, default: false}
});

module.exports = mongoose.model('user', userSchema);
const mongoose = require('mongoose');

const accessTokenSchema = mongoose.Schema({
  user: String,
  token: String,
  created: {type: Date, default: Date.now},
  last_ip: String,
  last_loaction: String,
  last_login: String
});

module.exports = mongoose.model('accesstoken', accessTokenSchema);
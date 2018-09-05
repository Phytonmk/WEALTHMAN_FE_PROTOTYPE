const mongoose = require('mongoose');

var KYCBlankScheme = mongoose.Schema({
  user: String,
  id: String,
  selfy: String,
  data: {} 
});

module.exports = mongoose.model('KYCBlank', KYCBlankScheme);
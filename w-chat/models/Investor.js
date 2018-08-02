const mongoose = require('mongoose');

var investorScheme = mongoose.Schema({
  img: String,
  user: String,
  name: String,
  surname : String,
});

module.exports = mongoose.model('investor', investorScheme);
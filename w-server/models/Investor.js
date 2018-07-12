const mongoose = require('mongoose');

var investorScheme = mongoose.Schema({
  id: Number,
  img: String,
  user: Number,
  name: String,
  surname : String,
  riskprofile: Number,
  avatar: String,
  phone_number: String,
  age: Number,
  country: String,
  adress: String,
  wallet_address: String
});

module.exports = mongoose.model('investor', investorScheme);
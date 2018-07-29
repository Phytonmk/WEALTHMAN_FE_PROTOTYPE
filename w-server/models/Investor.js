const mongoose = require('mongoose');

var investorScheme = mongoose.Schema({
  img: String,
  user: String,
  name: String,
  surname : String,
  riskprofile: Number,
  avatar: String,
  phone_number: String,
  age: Number,
  country: String,
  adress: String,
  wallet_address: String,
  registred: {type: Date, default: Date.now}
});

module.exports = mongoose.model('investor', investorScheme);
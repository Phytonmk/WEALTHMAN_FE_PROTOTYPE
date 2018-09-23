const mongoose = require('mongoose')

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
  registered: {type: Date, default: Date.now},
  aum: {type: Number, default: 0},
  aum6m: {type: Array, default: [0, 0, 0, 0, 0, 0]},
  online: {type: Boolean, default: true},
  last_active: {type: Date, default: Date.now},
  kyc_filled: {type: Boolean, default: false},
  last_target: {type: String, default: '-'},
  managers_amount: {type: Number, default: 0},
  source: {type: String, default: 'Application'},
  portfolios: {type: Number, default: 0}
})

module.exports = mongoose.model('investor', investorScheme)
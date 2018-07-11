
const mongoose = require('mongoose');

const ManagerScheme = mongoose.Schema({
  id: Number,
  user: Number,
  name: String,
  surname: String,
  company_name: String,
  company_link: String,
  methodology: String,
  exit_fee: String,
  managment_fee: String,
  font_fee: String,
  performance_fee: String,
  tweeter: String,
  fb: String,
  linkedin: String,
  about: String,
  wallet_address: String
});

module.exports = mongoose.model('Manager', ManagerScheme);

const mongoose = require('mongoose');

const ServiceSchema = require('../schemas/ServiceSchema');

const ManagerScheme = mongoose.Schema({
  img: String,
  user: String,
  name: String,
  surname: String,
  company: {type: String, default: null},
  company_name: String,
  company_link: String,
  methodology: String,
  exit_fee: String,
  management_fee: String,
  front_fee: String,
  performance_fee: String,
  social: [String],
  about: String,
  wallet_address: String,
  services: [ServiceSchema],
  registered: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Manager', ManagerScheme);

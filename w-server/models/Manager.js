
const mongoose = require('mongoose');

const ServiceSchema = require('../schemas/ServiceSchema');

const ManagerScheme = mongoose.Schema({
  id: Number,
  img: String,
  user: Number,
  name: String,
  surname: String,
  company: {type: Number, default: null},
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
  services: [ServiceSchema]
});

module.exports = mongoose.model('Manager', ManagerScheme);


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
  registered: {type: Date, default: Date.now},
  aum: {type: Number, default: 0},
  aum6m: {type: Array, default: [0, 0, 0, 0, 0, 0]},
  clients: {type: Number, default: 0},
  portfolios: {type: Number, default: 0},
  views: {type: Number, default: 0}
});

module.exports = mongoose.model('Manager', ManagerScheme);

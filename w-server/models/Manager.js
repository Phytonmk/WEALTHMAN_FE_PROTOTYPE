
const mongoose = require('mongoose');

const ServiceSchema = mongoose.Schema({
  type: Number, //0 - Robo-advisor, 1 - Discretionary, 2 - Advisory
  fee: Number,
  recalculation: Number // - in days
});

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
  managment_fee: String,
  font_fee: String,
  performance_fee: String,
  tweeter: String,
  fb: String,
  linkedin: String,
  about: String,
  wallet_address: String,
  services: [ServiceSchema]
});

module.exports = mongoose.model('Manager', ManagerScheme);
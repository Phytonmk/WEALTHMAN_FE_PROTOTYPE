
const mongoose = require('mongoose');

const ServiceSchema = require('../schemas/ServiceSchema');

const CompanyScheme = mongoose.Schema({
  img: String,
  user: String,
  company: String,
  company_name: String,
  company_link: String,
  founded: String,
  company_size: String,
  headqueartet: String,
  methodology: String,
  fees: String,
  tweeter: String,
  fb: String,
  linkedin: String,
  about: String,
  services: [ServiceSchema],
  registered: {type: Date, default: Date.now},
  aum: {type: Number, default: 0},
  aum6m: {type: Array, default: [0, 0, 0, 0, 0, 0]},
  clients: {type: Number, default: 0}
});

module.exports = mongoose.model('Company', CompanyScheme);
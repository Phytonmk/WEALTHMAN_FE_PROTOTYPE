
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
  registered: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Company', CompanyScheme);
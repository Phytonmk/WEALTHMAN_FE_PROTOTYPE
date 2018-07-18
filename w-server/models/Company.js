
const mongoose = require('mongoose');

const ServiceSchema = mongoose.Schema({
  type: Number, //0 - Robo-advisor, 1 - Discretionary, 2 - Advisory
  fee: Number,
  recalculation: Number // - in days
});

const CompanyScheme = mongoose.Schema({
  id: Number,
  img: String,
  user: Number,
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
  services: [ServiceSchema]
});

module.exports = mongoose.model('Company', CompanyScheme);
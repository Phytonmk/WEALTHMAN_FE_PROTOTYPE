
const mongoose = require('mongoose');

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
});

module.exports = mongoose.model('Company', CompanyScheme);
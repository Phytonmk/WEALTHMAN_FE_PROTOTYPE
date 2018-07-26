
const mongoose = require('mongoose');

const CompanyScheme = mongoose.Schema({
  img: String,
  user: Number,
  company_name: String,
});

module.exports = mongoose.model('Company', CompanyScheme);
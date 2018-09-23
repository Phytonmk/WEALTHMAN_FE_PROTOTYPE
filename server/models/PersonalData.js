
const mongoose = require('mongoose');

const PersonalDataScheme = mongoose.Schema({
  user: String,
  email: String,
  phone: String,
  firstName: String,
  lastName: String,
  nationality: String,
  address: String,
  postalCode: String,
  city: String,
  state: String,
  country: String,
});

module.exports = mongoose.model('PersonalData', PersonalDataScheme);
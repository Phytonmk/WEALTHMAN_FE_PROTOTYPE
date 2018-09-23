const mongoose = require('mongoose')

const OAuthSchema = mongoose.Schema({
  user: String,
  service: String,
  in_service_id: String,
  token: String,
  additional: {}
});

module.exports = mongoose.model('OAuth', OAuthSchema)
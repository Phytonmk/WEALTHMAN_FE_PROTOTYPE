const mongoose = require('mongoose');

const TelegramAcceptionSchema = mongoose.Schema({
  last_update: {type: Boolean, default: false},
  update_id: Number,
  // ----
  asked_request: String
});

module.exports = mongoose.model('TelegramAcception', TelegramAcceptionSchema);
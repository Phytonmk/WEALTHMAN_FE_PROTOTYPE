const mongoose = require('mongoose');

var ChatScheme = mongoose.Schema({
  users: [Number],
  last_message: {
    sender_id: Number,
    pics: [String, String],
    names: [String, String],
    date: Date,
    text_preview: String
  }
});

module.exports = mongoose.model('Chat', ChatScheme);

const mongoose = require('mongoose');

const ManagerScheme = mongoose.Schema({
  img: String,
  user: Number,
  name: String,
  surname: String,
});

module.exports = mongoose.model('Manager', ManagerScheme);

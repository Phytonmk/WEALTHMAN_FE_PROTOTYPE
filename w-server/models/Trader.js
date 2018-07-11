const mongoose = require('mongoose');

const TraderScheme = mongoose.Schema({
  type: String,
  id: Number,
  name: String,
  surname: String,
  age: Number,
  img: String,
  company: Number,
  money: Number,
  methodology: String,
  biography: String,
  social: {
    "facebook": String,
    "linkedin": String
  },
  terms: String,
  investors: Number,
  rating: Number,
  aum: Number,
  assets: Number,
  profit: Number,
  initial: Number,
  output: Number,
  annual: Number,
  clients: Number,
});

module.exports = mongoose.model('Trader', TraderScheme);
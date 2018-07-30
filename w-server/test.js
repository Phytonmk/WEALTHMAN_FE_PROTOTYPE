const mongoose = require('mongoose');

const configs = require('./configs')

var investorScheme = mongoose.Schema({
  img: String,
  user: String,
  name: String,
  surname : String,
  riskprofile: Number,
  avatar: String,
  phone_number: String,
  age: Number,
  country: String,
  adress: String,
  wallet_address: String,
  registred: {type: Date, default: Date.now}
});

const Investor = mongoose.model('investor', investorScheme);

mongoose.connect(configs.mongoUrl, {useNewUrlParser: true}, (err) => {
  if (err)
    console.log(err)
});

Investor.findById('5b5ec9c8dbfc345a6757c402', console.log)
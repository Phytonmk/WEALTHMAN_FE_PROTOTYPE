const mongoose = require('mongoose');

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

Investor.find({}, console.log)
const Manager = require('../models/Manager');
const Company = require('../models/Company');
const Investor = require('../models/Investor');

module.exports = (user) => new Promise(async (resolve, reject) => {
  const investor = await Investor.findOne({user});
  if (investor !== null) {
    resolve({
      name: (investor.name || '') + ' ' + (investor.surname || ''),
      img: investor.img,
      userId: user
    });
    return;
  } 
  const manager = await Manager.findOne({user});
  if (manager !== null) {
    resolve({
      name: (manager.name || '') + ' ' + (manager.surname || ''),
      img: manager.img,
      userId: user
    });
    return;
  } 
  const company = await Company.findOne({user});
  if (company !== null) {
    resolve({
      name: company.company_name,
      img: company.img,
      userId: user
    });
    return;
  }
  resolve({unsuccess: true});
})
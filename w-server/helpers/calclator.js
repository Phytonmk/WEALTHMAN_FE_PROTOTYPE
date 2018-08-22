const Request = require('../models/Request')
const Portfolio = require('../models/Portfolio')
const Manager = require('../models/Manager')
const Investor = require('../models/Investor')
const Company = require('../models/Company')
const aum = (personId, presonType='manager') => new Promise(async (resolve, reject) => {
  if (!['manager', 'investor', 'company'].includes(presonType)) {
    reject(`Wrong presonType ${presonType}`)
    return
  }
  const requests = await Request.find({status: 'active', [presonType]: personId})
  const tokens = []
  for (let request of requests) {
    const portfolio = await Porfolio.findOne({state: 'active', request: request._id})
    
  }
})
const Request = require('../models/Request')
const Portfolio = require('../models/Portfolio')
const Manager = require('../models/Manager')
const Order = require('../models/Order')
const getPaidComissions = require('../trading/get-paid-comissions')
const configs = require('../configs')
const ccxt = require('ccxt')
const exchanges = []
for (let exchange of configs.exchanges) {
  exchange.api = new ccxt[exchange.name]({
    apiKey: exchange.key,
    secret: exchange.secret,
    test: !configs.productionMode
  })
  exchanges.push(exchange)
}


const services = ['Robo-advisor', 'Discretionary', 'Advisory']

module.exports = (manager, specRequest=false) => new Promise(async (resolve, reject) => {
  let accrued = 0, paid = 0
  const requests = specRequest ? [specRequest] : await Request.find({manager: manager._id})

  for (let request of requests) {
    const portfolio = await Portfolio.findOne({request: request._id, state: 'active'})
    if (portfolio === null)
      continue
    let error = false
    const paidComissions = await getPaidComissions(portfolio.smart_contract)
      .catch((e) => {
        console.log('Error while getting comissions'/*, e*/)
        error = e
      })
    if (error) {
      continue
    } else {
      paid += paidComissions
    }
    const values = []
    const initValues = []
    for (let token of portfolio.currencies) {
      const tokenName = token.currency
      const symbol = tokenName.toUpperCase() + '/ETH'
      const exchange = exchanges[0]
      const currentPrice = (await exchange.api.fetchTicker(symbol)).last
      values.push(currentPrice)
    }
    const sumValue = values.length === 0 ? 0 : values.reduce((a, b) => a + b, 0)
    const managmentFee = request.managment_fee / 100
    const performanceFee = request.perfomance_fee / 100
    const managmentReward = sumValue * managmentFee
    const performanceReward = Math.abs(sumValue - request.initial_value) * performanceFee
    accrued += (managmentReward + performanceReward)
    if (specRequest !== false) {
      resolve({accrued, paid, managmentReward, performanceReward})
      return
    }
  }
  resolve({accrued, paid})
})
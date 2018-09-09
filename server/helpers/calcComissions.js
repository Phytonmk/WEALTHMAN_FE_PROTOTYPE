const Request = require('../models/Request')
const Portfolio = require('../models/Portfolio')
const Manager = require('../models/Manager')
const Order = require('../models/Order')
const getPaidComissions = require('../trading/Reward')
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

module.exports = (manager) => new Promise(async (resolve, reject) => {
  let accrued = 0, paid = 0
  const requests = await Request.find({manager: manager._id})
  for (let request of requests) {
    const portfolio = await Portfolio.findOne({request: request._id, state: 'active'})
    if (portfolio === null)
      continue
    const values = []
    for (let token of portfolio.currencies) {
      const tokenName = token.currency
      const orders = await Order.find({
        status: 'completed',
        request: request._id,
        token_name: tokenName.toUpperCase()
      }).sort({_id: -1}).limit(1)
      const order = orders[0]
      const exchange = exchanges[0]
      if (order !== null) {
        const symbol = tokenName.toUpperCase() + '/ETH'
        const currentPrice = (await exchange.api.fetchTicker(symbol)).last
        values.push(currentPrice - order.cost)
      }
    }
    let fee = null
    for (let service of manager.services) {
      if (services[service.type].toLowerCase() == request.service.toLowerCase()) {
        fee = service.perfomance_fee / 100
        break
      }
    }
    if (fee === null)
      continue
    const sumValue = values.length === 0 ? 0 : values.reduce((a, b) => a + b, 0)
    accrued += sumValue * fee
    console.log(`Asking commisions for ${portfolio.smart_contract}`)
    let error = false
    const paidComissions = await getPaidComissions(portfolio.smart_contract)
      .catch((e) => {
        console.log('Error while getting comissions', e)
        error = e
      })
    if (error) {
      continue
    } else {
      paid += paidComissions
      console.log(`Got commisions for ${portfolio.smart_contract}: ${paidComissions}`)
    }
  }
  resolve({accrued, paid})
})
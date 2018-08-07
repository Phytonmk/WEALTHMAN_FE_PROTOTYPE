const Request = require('../../models/Request')
const Order = require('../../models/Order')
const Stock = require('../../models/Stock')
const Porfolio = require('../../models/Porfolio')
const PaidCommisions = require('../../models/PaidCommisions')

const callCommisionsPay = require('../../trading/call_commisions')

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

const tokenTitles = {}
let gotTokens = false
Stock.find({})
  .then(stocks => {
    gotTokens = true
    stocks.forEach(stock =>
      tokenTitles[stock.name] = stock.title)
  })

module.exports = () => new Promise(async (resolve, reject) => {
  if (!gotTokens) {
    resolve()
    return
  }
  if (true || (new Date()).getHours() === 12) {
    const requests = await Request.find({})
    for (let request of requests) {
      const daysFromDeplyment = Math.floor((new Date().getTime() - (request.contract_deployment).getTime()) / (1000 * 60 * 60 * 24))
      const lastPay = await PaidCommisions.findOne({})
      const daysFromLastPay = Math.floor((new Date().getTime() - (lastPay.date).getTime()) / (1000 * 60 * 60 * 24))
      if (lastPay === null && daysFromDeplyment > request.commissions_frequency || daysFromLastPay > request.commissions_frequency) {
        const portfolio = await Porfolio.findOne({request: request._id})
        const tokens = []
        const values = []
        for (let token of portfolio.currencies) {
          const tokenName = tokenTitles[token.currency]
          tokens.push(tokenName)
          const order = await Order.findOne({contract_address: portfolio.smart_contact})
          const exchange = exchanges[0]
          const symbol = tokenName.toUpperCase() + '/ETH'
          const currentPrice = (await exchange.api.fetchTicker(symbol)).last
          values.push(currentPrice - order.cost)
        }
        await callCommisionsPay(portfolio.smart_contact, tokens, values)
      }
    }
  }
  resolve()
})

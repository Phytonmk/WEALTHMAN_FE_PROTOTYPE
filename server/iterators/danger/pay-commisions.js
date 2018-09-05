const configs = require('../../configs')
const Request = require('../../models/Request')
const Order = require('../../models/Order')
const Stock = require('../../models/Stock')
const Portfolio = require('../../models/Portfolio')
const PaidCommisions = require('../../models/PaidCommisions')
const TGlogger = require('../../helpers/tg-testing-loger')

const callCommisionsPay = require('../../trading/call_commissions')

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

module.exports = () => new Promise(async (resolve, reject) => {
  if (true || (new Date()).getHours() === 12) {
    const requests = await Request.find({})
    for (let request of requests) {
      const daysFromDeplyment = Math.floor((new Date().getTime() - (new Date(request.contract_deployment)).getTime()) / (1000 * 60 * 60 * 24))
      const lastPay = await PaidCommisions.findOne({})
      const daysFromLastPay = lastPay ? Math.floor((new Date().getTime() - (new Date(lastPay.date)).getTime()) / (1000 * 60 * 60 * 24)) : null
      if (lastPay === null && daysFromDeplyment > request.commissions_frequency || daysFromLastPay > request.commissions_frequency) {
        const portfolio = await Portfolio.findOne({request: request._id})
        const tokens = []
        const values = []
        const order = await Order.findOne({contract_address: portfolio.smart_contact})
        if (order !== null) {
          const exchange = exchanges[0]
          for (let token of portfolio.currencies) {
            const tokenName = token.currency
            tokens.push(tokenName)
            const symbol = tokenName.toUpperCase() + '/ETH'
            const currentPrice = (await exchange.api.fetchTicker(symbol)).last
            values.push(currentPrice - order.cost)
          }
          await TGlogger(`Called comissions paying for request #${request._id} ${JSON.stringify(tokens)} ${JSON.stringify(values)}`)
          await callCommisionsPay(portfolio.smart_contact, tokens, values)
            .catch(TGlogger)
        }
      }
    }
  }
  resolve()
})

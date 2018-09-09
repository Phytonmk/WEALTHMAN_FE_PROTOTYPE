const configs = require('../../configs')
const Request = require('../../models/Request')
const Order = require('../../models/Order')
const Stock = require('../../models/Stock')
const Portfolio = require('../../models/Portfolio')
// const PaidCommisions = require('../../models/PaidCommisions')
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
const exchange = exchanges[0]

module.exports = () => new Promise(async (resolve, reject) => {
  if (true || (new Date()).getHours() === 12) {
    const requests = await Request.find({})
    for (let request of requests) {
      const daysFromDeplyment = Math.floor((new Date().getTime() - (new Date(request.contract_deployment)).getTime()) / (1000 * 60 * 60 * 24))
      // const lastPay = await PaidCommisions.findOne({})
      const daysFromLastPay = request.lastPayedComission ? Math.floor((new Date().getTime() - (new Date(request.lastPayedComission)).getTime()) / (1000 * 60 * 60 * 24)) : daysFromDeplyment
      if (daysFromLastPay > request.commissions_frequency) {
        const portfolio = await Portfolio.findOne({request: request._id, state: 'active'})
        const tokens = []
        const values = []
        for (let token of portfolio.currencies) {
          const tokenName = token.currency
          const orders = await Order.find({
            status: 'completed',
            request: request._id,
            token_name: tokenName.toUpperCase()
          }).sort({_id: -1}).limit(1)
          const order = orders[0]
          if (order) {
            const symbol = tokenName.toUpperCase() + '/ETH'
            const currentPrice = (await exchange.api.fetchTicker(symbol)).last
            tokens.push(tokenNames)
            values.push(currentPrice - order.cost)
          }
        }
        if (tokens.length === 0 || values.length === 0)
          continue
        await TGlogger(`Called comissions paying for request #${request._id} ${JSON.stringify(tokens)} ${JSON.stringify(values)}`)
        await callCommisionsPay(portfolio.smart_contact, tokens, values)
          .catch(TGlogger)
        request.set({lastPayedComission: new Date()})
        await request.save()
      }
    }
  }
  resolve()
})
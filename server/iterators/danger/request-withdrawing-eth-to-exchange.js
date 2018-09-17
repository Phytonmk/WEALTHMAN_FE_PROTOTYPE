const Request = require('../../models/Request')
const Stock = require('../../models/Stock')
const Portfolio = require('../../models/Portfolio')
// const sendTokens = require('../../trading/send-tokens-to-exchange')
const configs = require('../../configs')
const ccxt = require('ccxt')
const TGlogger = require('../../helpers/tg-testing-loger')

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
  const requests = await Request.find({status: 'getting ethereum'})
  for (let request of requests) {
    const portfolio = await Portfolio.findOne({
      request: request._id,
      state: 'active'
    })
    if (portfolio === null)
      continue
    let value = 0
    const ethPriceData = await exchanges[0].api.fetchTicker('ETH/USDT')
        .catch(console.log)
    for (let currency of portfolio.currencies) {
      const stock = await Stock.findOne({title: currency.currency})
      value += currency.amount * stock.last_price / ethPriceData.last
    }
    await TGlogger(`Sending ${value} from exchange to ${portfolio.smart_contract} for request ${request._id}`)
    if (request.exchange_withdraw_allowed) {
      let withdraw = false, error = false
      if (configs.productionMode) {
        withdraw = await exchanges[0].api.withdraw('ETH', value, portfolio.smart_contract)
          .catch( async (e) => {
              console.log(e)
              await TGlogger('Sending error')
              error = e
          })
      }
      await TGlogger(`Sent to #${request._id}`)
      if ((withdraw && !error) || !configs.productionMode) {
        request.set({status: 'selling tokens'})
        await request.save()
      }
    }
  }
  resolve()
})
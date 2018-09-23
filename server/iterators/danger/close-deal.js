const Request = require('../../models/Request')
const Stock = require('../../models/Stock')
const Portfolio = require('../../models/Portfolio')
const sendTokens = require('../../trading/send-tokens-to-exchange')
const configs = require('../../configs')
const TGlogger = require('../../helpers/tg-testing-loger')

module.exports = () => new Promise(async (resolve, reject) => {
  const requests = await Request.find({status: 'selling tokens'})
  for (let request of requests) {
    const portfolio = await Portfolio.findOne({
      request: request._id,
      state: 'active'
    })
    if (portfolio === null)
      continue
    const tokens = []
    for (let currency of portfolio.currencies) {
      const stock = await Stock.findOne({title: currency.currency})
      tokens.push(stock.address)
    }
    await sendTokens(portfolio.smart_contract, tokens)
    await TGlogger(`Request #${request._id} sent tokens ${JSON.stringify(tokens)} to exchange`)
    request.set({status: 'waiting for withdraw'})
    await request.save()
  }
  resolve()
})
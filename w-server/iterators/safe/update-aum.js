const Portfolio = require('../../models/Portfolio')
const Request = require('../../models/Request')
const Manager = require('../../models/Manager')
const Investor = require('../../models/Investor')
const Stock = require('../../models/Stock')
const ccxt = require('ccxt')
const configs = require('../../configs')

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
  const managers = (await Manager.find()).map(manager => Object.assign(manager, {type: 'manager'}))
  const investors = (await Investor.find()).map(investor => Object.assign(investor, {type: 'investor'}))
  const users = managers.concat(investors)
  for (let user of users) {
    
    const requests = await Request.find({[user.type]: user._id, type: 'portfolio'})
    const tokens = []
    for (let request of requests) {
      const portfolio = await Portfolio.findOne({request: request._id, state: 'active'})
      if (portfolio === null)
        continue
      for (let currency of portfolio.currencies) {
        if (currency.currency !== undefined && currency.amount !== undefined)
          tokens.push({
            name: currency.currency.toUpperCase(),
            amount: currency.amount
          })
      }
    }
    
    const prices = {}
    const stocks = await Stock.find()
    for (let stock of stocks)
      prices[stock.title.toUpperCase()] = stock.last_price

    // let ethereumSumPrice = 0, ethereumPriceVars = 0
    // for (let exchange of exchanges) {
    //   const ethPriceData = await exchange.api.fetchTicker('ETH/USDT')
    //     .catch(console.log)
    //   ethereumSumPrice += ethPriceData.last
    //   ethereumPriceVars++
    // }
    // const ethPrice = ethereumSumPrice / ethereumPriceVars

    let aum = 0
    for (let token of tokens) {
      aum += token.amount * prices[token.name]/* * ethPrice*/
    }
    user.set({aum})
    user.save()
  }

  resolve()
})
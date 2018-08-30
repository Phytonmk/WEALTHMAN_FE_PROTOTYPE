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
    // const requests = await Request.find({[user.type]: user._id, type: 'portfolio'})
    // const tokens = []
    // for (let request of requests) {
    const portfolios = await Portfolio.find({[user.type]: user._id, state: 'active'})
    for (let portfolio of portfolios) {
      let portfolioBalance = 0
      for (let currency of portfolio.currencies) {
        if (currency.currency !== undefined && currency.amount !== undefined) {
          portfolioBalance += currency.amount * prices[currency.currency.toUpperCase()]/* * ethPrice*/
          aum += portfolioBalance
        }
          // tokens.push({
          //   name: currency.currency.toUpperCase(),
          //   amount: currency.amount
          // })
      }
      portfolio.set({balance: portfolioBalance})
      await portfolio.save()
    }
    user.set({aum})
    user.save()
  }

  resolve()
})
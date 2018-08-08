const configs = require('../../configs')
const Request = require('../../models/Request')
const Portfolio = require('../../models/Portfolio')
const Order = require('../../models/Order')
const Stock = require('../../models/Stock')
const ExchangeDepositsCheck = require('../../models/ExchangeDepositsCheck')

const axios = require('axios')

const depositHistory = (apiKey, secret, startTime) => new Promise((resolve, reject) => {
  const binance = require('node-binance-api')().options({
    APIKEY: apiKey,
    APISECRET: secret,
    test: !configs.productionMode
  })
  binance.depositHistory((err, res) => {
    if (err)
      reejct(err)
    else
      resolve(res)
  })
})

module.exports = () => new Promise(async (resolve, reject) => {
  const exchange = configs.exchanges[0]
  const lastCheck = (await ExchangeDepositsCheck({exchange: exchange.name}) || {date: {getTime: () => 0}}).date.getTime()
  const thisCheck = new ExchangeDepositsCheck({exchange: exchange.name, date: Date.now()})
  const deposits = await depositHistory(exchange.key, exchange.secret, lastCheck)
  .catch(console.log)
  if (deposits.lastCheck) {
    for (let deposit of deposits.depositList) {
      if (deposit.insertTime > lastCheck && deposit.status === 1 && deposit.asset !== 'ETH') {
        const order = new Order({
          status: 'sell',
          quantity: deposit.amount,
          token_name: deposit.asset
        })
        await order.save()
      }
    }
    await thisCheck.save()
  }
  resolve()
})
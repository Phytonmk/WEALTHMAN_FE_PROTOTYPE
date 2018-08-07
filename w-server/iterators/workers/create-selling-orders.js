const Request = require('../../models/Request')
const Portfolio = require('../../models/Portfolio')
const Order = require('../../models/Order')
const Stock = require('../../models/Stock')
const ExchangeDepositsCheck = require('../../models/ExchangeDepositsCheck')

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
  const exchange = exchanges[0]
  const lastCheck = (await ExchangeDepositsCheck({exchange: exchange.name}) || {date: {getTime: () => 0}}).date.getTime()
  const thisCheck = new ExchangeDepositsCheck({exchange: exchange.name, date: Date.now()})
  const deposits = await exchange.api.privateGet(`/wapi/v3/depositHistory.html?timestamp=${Date.now()}&startTime=${lastCheck}`)
  .catch(console.log)
  console.log(deposits)
  if (deposits.lastCheck) {
    for (let deposit of deposits.depositList) {
      if (deposit.status === 1 && deposit.asset !== 'ETH') {
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
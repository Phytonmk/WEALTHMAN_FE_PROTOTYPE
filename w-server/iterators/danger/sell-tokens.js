const Binance = require('node-binance-api')
const Order = require('../../models/Order')
const Stock = require('../../models/Stock')
const configs = require('../../configs')
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
  const orders = await Order.find({status: 'sell'})
  for (let order of orders) {
    const symbol = order.token_name + '/ETH'
    const stock = await Stock.findOne({title: order.token_name})
    let lowestPrice = {
      price: null,
      exchange: null
    }
    for (let exchange of exchanges) {
      const price = await exchange.api.fetchTicker(symbol)
      if (lowestPrice.price === null || lowestPrice.price < price.last) {
        lowestPrice = {
          price: price.last,
          exchange: exchange
        }
      }
    }
    const sell = await lowestPrice.exchange.api.createOrder(symbol, 'market', 'sell', order.quantity)
      .catch(async (e) => {
        console.log(e)
        order.set({status: 'failed to sell token'})
        await order.save()
      })
    if (sell) {
      console.log(sell)
      order.set({
        status: 'token bouthg',
        quantity
      })
      await order.save()
    }
  }
  resolve()
})
const Binance = require('node-binance-api')
const Order = require('../../models/Order')
const Stock = require('../../models/Stock')
const Request = require('../../models/Request')
const Portfolio = require('../../models/Portfolio')
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
  const orders = await Order.find({$or: [{status: 'buy'}, {status: 'token bouthg'}]})
  for (let order of orders) {
    if (order.status === 'buy') {
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
      const price = lowestPrice.price
      const feeRate = 0.01 // update it later
      const ethPrice = 1//(await lowestPrice.exchange.api.fetchTicker('ETH/USDT')).last
      const fee = Math.ceil((ethPrice * feeRate) / price)
      const quantity = Math.floor(((order.percent / 100) / price) * order.whole_eth_amount)

      await TGlogger(`Buying ${quantity} + ${fee} = ${(quantity + fee)} "${symbol}" for request #${request._id}`)
      let purshcase = null
      if (configs.productionMode) {
        purshcase = await lowestPrice.exchange.api.createOrder(symbol, 'market', 'buy', quantity + fee)
          .catch(async (e) => {
              await TGlogger(e)
              order.set({status: 'failed to buy token'})
              await order.save()
          })
      }
      if (purshcase || !configs.productionMode) {
        console.log(purshcase)
        /*
        { info:
         { symbol: 'ZILETH',
           orderId: 19632912,
           clientOrderId: 'HUbMD1GrKM4A1byt6NiK3u',
           transactTime: 1535368029748,
           price: '0.00000000',
           origQty: '228.00000000',
           executedQty: '228.00000000',
           cummulativeQuoteQty: '0.03508008',
           status: 'FILLED',
           timeInForce: 'GTC',
           type: 'MARKET',
           side: 'BUY' },
        id: '19632912',
        timestamp: 1535368029748,
        datetime: '2018-08-27T11:07:09.748Z',
        lastTradeTimestamp: undefined,
        symbol: 'ZIL/ETH',
        type: 'market',
        side: 'buy',
        price: 0,
        amount: 228,
        cost: 0,
        filled: 228,
        remaining: 0,
        status: 'closed',
        fee: undefined,
        trades: undefined }
        */
        const portfolio = await Portfolio.findOne({smart_contract: order.contract_address, state: 'active'})
        if (portfolio.currencies) {
          for (let currency of portfolio.currencies) {
            if (currency.currency === order.token_name) {
              currency.amount = quantity
              break
            }
          }
        }
        order.set({
          cost: price,
          status: 'token bouthg',
          quantity
        })
        await portfolio.save()
        await order.save()
      }
    } else if (order.status === 'token bouthg') {
      let withdrawing = null
      const request = await Request.findById(order.request)
      if (request.exchange_withdraw_allowed) {
        await TGlogger(`Withdrawing ${order.quantity} "${order.token_name}" to ${order.contract_address} for request #${request._id}`)
        if (configs.productionMode) {
          withdrawing = await exchanges[0].api.withdraw(order.token_name, order.quantity, order.contract_address)
            .catch( async (e) => {
                await TGlogger(e)
                order.set({status: 'failed to withdraw'})
                await order.save()
            })
        }
      }
      if (withdrawing || !configs.productionMode) {
        order.set({
          status: 'completed'
        })
        await order.save()
      }
    }
  }
  resolve()
})
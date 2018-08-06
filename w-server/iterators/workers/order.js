const Binance = require('node-binance-api');
const Order = require('../../models/Order');
const Stock = require('../../models/Stock');
const configs = require('../../configs');
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
  const orders = await Order.find({$or: [{status: 'created'}, {status: 'token bouthg'}]});
  for (let order of orders) {
    if (order.status === 'created') {
      const symbol = order.token_name + '/ETH';
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
      const quantity = Math.floor((order.percent / price) * order.whole_eth_amount)
      const purchase = await lowestPrice.exchange.api.createOrder(symbol, 'market', 'buy', quantity + fee)
        .catch(async (e) => {
          console.log(e);
          order.set({status: 'failed to buy token'});
          await order.save();
        })
      if (purchase) {
        console.log(purchase)
        order.set({
          cost: price.last,
          status: 'token bouthg',
          quantity
        });
        await order.save();
      }
    } else if (order.status === 'token bouthg') {
      const withdrawing = await withdraw(order.token_name, order.contract_address, order.quantity)
        .catch( async (e) => {
          console.log(e);
          order.set({status: 'failed to withdraw'});
          await order.save();
        }); 
      if (withdrawing) {
        console.log(withdrawing);
        order.set({
          status: 'completed'
        });
        await order.save();
      }
    }
  }
  resolve()
})
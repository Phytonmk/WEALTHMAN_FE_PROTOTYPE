// module.exports = () => new Promise((resolve, reject) => setTimeout(resolve, 60 * 20 * 1000))
const Binance = require('node-binance-api');
const Order = require('../../models/Order');
const Stock = require('../../models/Stock');
const configs = require('../../configs');
const ccxt = require('ccxt')



// const marketBuy = (exchange, ticker, quantity, falgs) => new Promise((resolve, reject) => {
  
//   binance.marketBuy(ticker, quantity, falgs, (err, response) => {
//     if (err)
//       reject(err);
//     else
//       resolve(response);
//   })
// });

// const withdraw = (exchange, name, address, quantity) => new Promise((resolve, reject) => {
//   binance.withdraw(name, address, quantity, false, (err, response) => {
//     if (err)
//       reject(err);
//     else
//       resolve(response)
//   })
// });


const flags = { type: 'MARKET', newOrderRespType: 'FULL' };

let workingProcess = false;

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
    // const stock = await Stock.findOne({title: })
    throw 'error, orders are not ready'
    if (order.status === 'created') {
      const symbol = order.token_name + '/ETH';
      const Stock = await Stock.findOne({title: order.token_name})
      let lowestPrice = {
        price: null,
        exchange: null
      }
      for (let exchange of exchanges) {
        const price = await exchange.api.fetchTicker(symbol)
        if (lowestPrice.price === null || lowestPrice.price < price.last) {
          lowestPrice = {
            price: price.last,
            exchange: exchange.name
          }
        }
      }

      const quantity = (order.percent / lowestPrice.price) * order.whole_eth_amount

      const purchase = await exchange.api.createOrder(symbol, 'limit', 'buy', quantity, price.last)
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


      // const withdrawingResult = await withdraw(order.token_name, order.contract_address, quantity)
      //   .catch( async (e) => {
      //     console.log(e);
      //     order.set({status: 'failed to withdraw'});
      //     await order.save();
      //   }); 
      // if (withdrawingResult) {
      //   console.log(buyingResult);
      //   order.set({
      //     status: 'completed'
      //   });
      //   await order.save();
      // }
    }
  }
  resolve()
})
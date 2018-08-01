// module.exports = () => new Promise((resolve, reject) => setTimeout(resolve, 60 * 20 * 1000))
const Binance = require('node-binance-api');
const Order = require('../../models/Order');
const configs = require('../../configs');

binance = new Binance().options({
  APIKEY: configs.binanceApi.key,
  APISECRET: configs.binanceApi.secret,
  useServerTime: true,
  test: false
});

const marketBuy = (ticker, quantity, falgs) => new Promise((resolve, reject) => {
  binance.marketBuy(ticker, quantity, falgs, (err, response) => {
    if (err)
      reject(err);
    else
      resolve(response);
  })
});

const withdraw = (name, address, quantity) => new Promise((resolve, reject) => {
  binance.withdraw(name, address, quantity, false, (err, response) => {
    if (err)
      reject(err);
    else
      resolve(response)
  })
});

const flags = { type: 'MARKET', newOrderRespType: 'FULL' };

let workingProcess = false;

module.exports = () => new Promise(async (resolve, reject) => {
  const orders = await Order.find({$or: [{status: 'created'}, {status: 'token bouthg'}]});
  for (let order of orders) {
    const quantity = 90; // update it
    if (order.status === 'created') {
      const ticker = order.token_name + 'ETH';
      const buyingResult = await marketBuy(ticker, quantity, flags)
        .catch( async (e) => {
          console.log(e);
          order.set({status: 'failed to buy token'});
          await order.save();
        }); 
      if (buyingResult) {
        console.log(buyingResult);
        order.set({
          cost: 99, // update it
          status: 'token bouthg'
        });
        await order.save();
      }
    } else if (order.status === 'token bouthg') {
      const withdrawingResult = await withdraw(order.token_name, order.contract_address, quantity)
        .catch( async (e) => {
          console.log(e);
          order.set({status: 'failed to withdraw'});
          await order.save();
        }); 
      if (withdrawingResult) {
        console.log(buyingResult);
        order.set({
          status: 'completed'
        });
        await order.save();
      }
    }
  }
})
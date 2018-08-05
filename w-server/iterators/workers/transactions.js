const Request = require('../../models/Request');
const Portfolio = require('../../models/Portfolio');
const Order = require('../../models/Order');
const Stock = require('../../models/Stock');

const checkBalance = require('../../trading/wealthman_check_balance');
const trade = require('../../trading/wealthman_trade');

const tokenTitles = {}
Stock.find({})
  .then(stocks => 
    stocks.forEach(stock =>
      tokenTitles[stock.name] = stock.title))
setTimeout(() => console.log(tokenTitles), 1000)

module.exports = () => new Promise(async (resolve, reject) => {
  const requests = await Request.find({status: 'waiting for deposit'});
  const smartContracts = [];
  let i = 0;
  for (request of requests) {
    const portfolio = await Portfolio.findOne({request: request._id});
    if (portfolio !== null && portfolio.smart_contract)
      smartContracts.push({
        address: portfolio.smart_contract,
        portfolio: portfolio._id,
        request: request._id,
        currencies: portfolio.currencies
      });
  }
  for (let smartContract of smartContracts) {
    console.log(`Checking ${smartContract.address} for deposit...`);
    const deposit = await checkBalance(smartContract.address).catch(console.log);
    if (deposit)
      console.log('deposited');
    else
      console.log('no deposit');
    if (deposit) {
      const request = await Request.findById(smartContract.request);
      trade(smartContract.address, smartContract.request);
      request.set({status: 'active'});  
      await request.save();
      for (let token of smartContract.currencies) {
        const order = new Order({
          token_name: tokenTitles[token.currency],
          whole_eth_amount: request.value,
          percent: token.percent,
          contract_address: smartContract.address
        });
        await order.save();
      }
    }
  }
  resolve()
})
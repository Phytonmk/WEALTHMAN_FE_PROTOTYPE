const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY:'0eEhZb5rMmXjeQcGJp6Ho4V6xUlM7LjG8VLbknB6Yf1GuUVkZfGcQhaSjQe7vqfb',
  APISECRET:'XoiqvoqSImVgidD8jX7IBQ8j3lUhS9jMOWuSE2p3OuQkbMgXjP2p2wk5nuwNC239',
  useServerTime: true,
  test:false
});
////////Сюда вставить схмему портфеля и адрес/////////////////////////
const Portfolio = require('../modles/Portfolio');
const portfolio_adress = ''
////////////////////////////////
module.exports 
const porfolio = Portfolio.findOne({ smart_contract: portfolio_adress }, function(err,res){
  let orders = []
  res.currencies.forEach(function(item, i, arr) {
    orders.push({
      name: item.title.toUpperCase(),
      ticker: item.title.toUpperCase() + "ETH",
      quantity: item.amount
    })
  })
});
const flags = { type: 'MARKET', newOrderRespType: 'FULL' };
orders.forEach((item, i, arr) => {
  binance.marketBuy(item.ticker, item.quantity, flags, (error, response) => {
    if (error) return console.error('error');
    console.log(response);
     //тут записать цены по каждой покупке в бд, пока не делаем
   })
   binance.withdraw(item.name, portfolio_adress, item.quantity, false , (error, response) => {
     console.log(error,response)
   })
})

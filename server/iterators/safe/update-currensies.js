const configs = require('../../configs')
const Currency = require('../../models/Currency.js')
const ccxt = require('ccxt')
const axios = require('axios')
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

  const ethPriceData = await exchanges[0].api.fetchTicker('ETH/USDT')
        .catch(console.log)
  const ethPrice = ethPriceData.last
  const fixerData = await axios.get(`http://data.fixer.io/api/latest?access_key=${configs.fixerIoApiKey}&format=1&symbols=BTC,ETH,EUR,USD,GBP,CHF,RUB&base=EUR`)
  if (!fixerData.data.success) {
    await TGlogger(`Fixer api error: \n${JSON.stringify(fixerData.data, null, 2)}`)
    resolve()
    return
  }
  let eurPrice = 1
  for (let currency in fixerData.data.rates) {
    if (currency === 'USD') {
      eurPrice = 1 / fixerData.data.rates[currency]
      break
    }
  }
  for (let currency in fixerData.data.rates) {
    await Currency.findOneAndUpdate({title: currency}, {
      lastUpdate: Date.now(),
      title: currency,
      toUsdRate: eurPrice * fixerData.data.rates[currency],
      toEthRate: ethPrice * eurPrice * fixerData.data.rates[currency]
    }, {upsert: true})
  }
  await Currency.findOneAndUpdate({title: 'ETH'}, {
      lastUpdate: Date.now(),
      title: 'ETH',
      toUsdRate: 1 / ethPrice,
      toEthRate: 1
    }, {upsert: true})
  resolve()
})
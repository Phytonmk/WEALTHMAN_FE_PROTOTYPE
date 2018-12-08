const Stock = require('../../models/Stock.js')
const Currency = require('../../models/Currency.js')
module.exports = (app) => {
  // Получить список токенов, известных системе
  app.get('/api/stocks', async (req, res, next) => {
    res.status(200)
    const stocks = await Stock.find({})
    res.send(stocks)
    res.end()
  })
  // Получить список и курс к эфиру и доллару валют, отображаемых в интерфейсе
  app.get('/api/currencies', async (req, res, next) => {
    res.status(200)
    const currensies = await Currency.find({})
    res.send(currensies)
    res.end()
  })
}

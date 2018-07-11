const Stocks = require('../../models/StockTable.js');
module.exports = (app) => {
  app.get('/api/stocks', async (req, res, next) => {
    res.status(200);
    const stocks = await Stocks.find({})
    res.send(stocks);
    res.end();
  });
}
const Stock = require('../../models/Stock.js');
module.exports = (app) => {
  app.get('/api/stocks', async (req, res, next) => {
    res.status(200);
    const stocks = await Stock.find({})
    res.send(stocks);
    res.end();
  });
}
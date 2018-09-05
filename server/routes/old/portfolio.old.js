const Portfolio = require('../../models/Portfolio');

module.exports = (app) => {
  app.get('/api/portfolio/:traderId', async (req, res, next) => {
    res.status(200);
    const portfolio = await Portfolio.find({manager: req.params.id})
    res.send(portfolio);
    res.end();
  });

  app.post('/api/portfolio', async (req, res, next) => {
    const portfolio = new Portfolio(req.body);
    await portfolio.save().catch(console.log);
    res.status(200);
    res.end();
  });

  app.delete('/api/portfolio/:id', async (req, res, next) => {
    await Portfolio.findOneAndRemove({ _id: req.params.id })
    res.status(200);
    res.end();
  });
}
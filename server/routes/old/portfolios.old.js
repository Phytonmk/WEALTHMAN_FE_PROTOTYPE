const Portfolios = require('../../models/Portfolio');

module.exports = (app) => {
  app.get('/api/portfolios/:traderId', async (req, res, next) => {
    res.status(200);
    const portfolios = await Portfolios.find({manager: req.params.traderId})
    res.send(portfolios);
    res.end();
  });

  app.post('/api/portfolios', async (req, res, next) => {
    const portfolios = new Portfolios(req.body);
    await portfolios.save().catch(console.log);
    res.status(200);
    res.end();
  });

  app.delete('/api/portfolios/:id', async (req, res, next) => {
    await Portfolios.findOneAndRemove({ _id: req.params.id })
    res.status(200);
    res.end();
  });
}
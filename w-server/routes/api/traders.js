const Trader = require('../../models/Trader');

module.exports = (app) => {
  app.get('/api/traders', async (req, res, next) => {
    res.status(200);
    console.log('traders');
    const traders = await Trader.find({})
    res.send(traders);
    res.end();
  });

  app.post('/api/trader', async (req, res, next) => {
    const trader = new Trader(req.body);
    console.log(trader);
    await trader.save().catch(console.log);
    res.status(200);
    res.end();
  });

  app.delete('/api/trader/:id', async (req, res, next) => {
    await Trader.findOneAndRemove({ _id: req.params.id })
    res.status(200);
    res.end();
  });
}
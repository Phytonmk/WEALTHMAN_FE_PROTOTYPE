const Manager = require('../../models/Manager');

module.exports = (app) => {
  app.get('/api/managers', async (req, res, next) => {
    const managers = await Manager.find({})
    res.status(200);
    res.send(managers);
    res.end();
  });
  app.get('/api/manager/:id', async (req, res, next) => {
    console.log(req.params.id);
    const manager = await Manager.findOne({id: req.params.id});
    if (manager === null) {
      res.status(404);
      res.end();
      return;
    }
    res.status(200);
    res.send(manager);
    res.end();
  });
  app.get('/api/manager-statisitcs/:id', async (req, res, next) => {
    console.log(req.params.id);
    const manager = await Manager.findOne({id: req.params.id});
    if (manager === null) {
      res.status(404);
      res.end();
      return;
    }
    const profitability = Math.ceil(Math.random() * 100);
    const clients = Math.ceil(Math.random() * 100);
    const portfolios = Math.ceil(Math.random() * 100);
    res.status(200);
    res.send({
      profitability,
      clients,
      portfolios
    });
    res.end();
  });
}
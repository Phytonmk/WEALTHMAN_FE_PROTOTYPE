const Investor = require('../../models/Investor');

module.exports = (app) => {
  app.get('/api/investors', async (req, res, next) => {
    const investors = await Investor.find({})
    res.status(200);
    res.send(investors);
    res.end();
  });
  app.get('/api/investor/:id', async (req, res, next) => {
    const investor = await Investor.findOne({id: req.params.id});
    if (investor === null) {
      res.status(404);
      res.end();
      return;
    }
    res.status(200);
    res.send(investor);
    res.end();
  });
}
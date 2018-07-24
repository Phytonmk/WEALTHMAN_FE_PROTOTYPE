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
  app.post('/api/withdraw/:request', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.status(403);
      res.end('');
      return;
    }
    const investor = await Investor.findOne({user: token.user});
    if (investor === null) {
      res.status(403);
      res.end();
      return;
    }
    // withdrawing...
    res.status(200);
    res.send(investor);
    res.end();
  });
}
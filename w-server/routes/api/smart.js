const Token = require('../../models/accessToken');
const Investor = require('../../models/Investor');
const Manager = require('../../models/Manager');
const Request = require('../../models/Request');

module.exports = (app) => {
  app.post('/api/get-smart-contract-data', async (req, res) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.status(403);
      res.end('');
      return;
    }
    const investor = await Investor.findOne({user: token.user});
    if (investor === null) {
      res.status(403);
      res.end('');
      return;
    }
    const request = await Request.findOne({investor: investor.id, id: req.params.id});
    if (request === null) {
      res.status(403);
      res.end('');
      return;
    }
    const manager = await Manager.findOne({id: request.manager});
    if (manager === null) {
      res.status(500);
      res.end('');
      return;
    }
    console.log(manager, manager.wallet_address);
    res.send({
      manager: manager.wallet_address || 'empty_wallet_address',
      investor: investor.wallet_address || 'empty_wallet_address'
    });
    res.status(200);
    res.end();
  })
  app.get('/smart', (req, res) => {
    res.status(200);
    res.end('');

    console.log('SMART CONTRACT');
  });
}
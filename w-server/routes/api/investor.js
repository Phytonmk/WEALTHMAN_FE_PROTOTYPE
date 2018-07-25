const Token = require('../../models/accessToken');
const Manager = require('../../models/Manager');
const Investor = require('../../models/Investor');
const Request = require('../../models/Request');
const Company = require('../../models/Company');

module.exports = (app) => {
  app.post('/api/investors-list', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.status(403);
      res.end('');
      return;
    }
    let userType;
    let userId;
    const manager = await Manager.findOne({user: token.user});
    if (manager === null) {
      const company = await Company.findOne({user: token.user});
      if (company === null) {
        res.status(403);
        res.end();
        return;
      }
      userType = 'company';
      userId = company.id;
    } else {
      userType = 'manager';
      userId = manager.id;
    }
    const investorsIds = [];
    const requests = await Request.find({[userType]: userId});
    for (let request of requests) {
      if (request.investor !== null && !investorsIds.includes(request.investor))
        investorsIds.push(request.investor);
    }
    const investors = [];
    for (let investorId of investorsIds) {
      const investor = await Investor.findOne({id: investorId});
      if (investor !== null)
        investors.push(investor);
    }
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
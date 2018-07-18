// company/invite-manager
const Token = require('../../models/accessToken');
const Company = require('../../models/Company');
const Request = require('../../models/Request');
const Manager = require('../../models/Manager');

module.exports = (app) => {
  app.post('/api/company/invite-manager', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.status(403);
      res.end('');
      return;
    }
    const company = await Company.findOne({user: token.user});
    if (company === null) {
      res.status(403);
      res.end('');
    }
    const manager = await Manager.findOne({id: req.body.manager});
    if (manager === null) {
      res.status(404);
      res.end();
      return;
    }
    const requestID = await Request.countDocuments({});
    const request = new Request({
      id: requestID,
      company: company.id,
      manager: manager.id,
      type: 'inviting'
    });
    await request.save();
    res.status(200);
    res.end();
  });
  app.get('/api/companies', async (req, res, next) => {
    const companies = await Company.find({})
    res.send(companies);
    res.end();
  });
  app.get('/api/company/:id', async (req, res, next) => {
    console.log(req.params.id);
    const company = await Company.findOne({id: req.params.id});
    if (company === null) {
      res.status(404);
      res.end();
      return;
    }
    res.send(company);
    res.end();
  });
  app.post('/api/company/accept-inviting', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.status(403);
      res.end('');
      return;
    }
    const manager = await Manager.findOne({user: token.user});
    if (manager === null) {
      res.status(403);
      res.end();
      return;
    }
    const company = await Company.findOne({id: req.body.company});
    if (company === null) {
      res.status(404);
      res.end('');
      return;
    }
    const request = await Request.findOne({id: req.body.request});
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    manager.set({company: company.id});
    request.set({status: 'accepted'});
    await manager.save();
    await request.save();
    res.status(200);
    res.end();
  });
}
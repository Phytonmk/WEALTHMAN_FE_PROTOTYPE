// company/invite-manager
const Token = require('../../models/accessToken');
const Company = require('../../models/Company');
const Request = require('../../models/Request');
const Manager = require('../../models/Manager');

const notify = require('../../helpers/notifications')

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
    const manager = await Manager.findById(req.body.manager);
    if (manager === null) {
      res.status(404);
      res.end();
      return;
    }
    const request = new Request({
      company: company.id,
      manager: manager.id,
      type: 'inviting'
    });
    await request.save();
    await notify({request: request._id, title: `Company ${company.company_name} invited ${(manager.name || '')} ${(manager.surname || '')}`})
    res.status(200);
    res.end();
  });
  app.get('/api/companies', async (req, res, next) => {
    const companies = await Company.find({})
    res.send(companies);
    res.end();
  });
  app.get('/api/company/:id', async (req, res, next) => {
    if(req.params.id === 'undefined') {
      console.log('trying to get undefined company');
      res.status(404);
      res.end();
      return;
    }
    const company = await Company.findById(req.params.id);
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
    const company = await Company.findById(req.body.company);
    if (company === null) {
      res.status(404);
      res.end('');
      return;
    }
    const request = await Request.findOne({
      _id: req.body.request,
      status: 'pending',
      initiatedByManager: false,
      manager: manager.id,
      company: company.id,
      type: 'inviting'
    });
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    manager.set({company: company.id});
    request.set({status: 'accepted'});
    await manager.save();
    await request.save();
    await notify({request: request._id, title: `Manager ${(manager.name || '')} ${(manager.surname || '')} accepted invite of company ${company.company_name}`})
    res.status(200);
    res.end();
  });
  app.get('/api/company-statistics/:id', async (req, res, next) => {
    const company = await Company.findById(req.params.id);
    if (company === null) {
      res.status(404);
      res.end();
      return;
    }
    const profitability = Math.ceil(Math.random() * 100);
    const clients = Math.ceil(Math.random() * 100);
    const portfolios = Math.ceil(Math.random() * 100);
    const managers = await Manager.find({company: company._id});
    res.status(200);
    res.send({
      profitability,
      clients,
      portfolios,
      managers
    });
    res.end();
  });

  app.post('/api/company/apply', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.status(403);
      res.end('');
      return;
    }
    const manager = await Manager.findOne({user: token.user});
    if (manager === null) {
      res.status(403);
      res.end('');
    }
    const company = await Company.findById(req.body.company);
    if (company === null) {
      res.status(404);
      res.end();
      return;
    }
    const request = new Request({
      company: company.id,
      manager: manager.id,
      type: 'inviting',
      initiatedByManager: true
    });
    await request.save();
    await notify({request: request._id, title: `Manager ${(manager.name || '')} ${(manager.surname || '')} requested to apply company ${company.company_name}`})
    res.status(200);
    res.end();
  });
  app.post('/api/company/accept-apply', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.status(403);
      res.end('');
      return;
    }
    const company = await Company.findOne({user: token.user});
    if (company === null) {
      res.status(403);
      res.end();
      return;
    }
    const manager = await Manager.findById(req.body.manager);
    if (manager === null) {
      res.status(404);
      res.end('');
      return;
    }
    const request = await Request.findOne({
      _id: req.body.request,
      status: 'pending',
      initiatedByManager: true,
      manager: manager.id,
      company: company.id,
      type: 'inviting'
    });
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    manager.set({company: company.id});
    request.set({status: 'accepted'});
    await manager.save();
    await request.save();
    await notify({request: request._id, title: `Company ${company.company_name} accepted apply of manager ${(manager.name || '')} ${(manager.surname || '')}`})
    res.status(200);
    res.end();
  });
}
const Token = require('../../models/accessToken');
const Investor = require('../../models/Investor');
const Manager = require('../../models/Manager');
const Request = require('../../models/Request');
const Portfolio = require('../../models/Portfolio');

module.exports = (app) => {
  app.post('/api/request', async (req, res, next) => {
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
    const requestID = await Request.countDocuments({});
    const request = new Request({
      id: requestID,
      investor: investor.id,
      manager: req.body.manager 
    });
    await request.save();
    res.status(200);
    res.end();
  });
  app.post('/api/get-request/:id', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.status(403);
      res.end('');
      return;
    }
    let user;
    let userID;
    let manager;
    let investor = await Investor.findOne({user: token.user});
    if (investor === null) {
      manager = await Manager.findOne({user: token.user});
      if (manager === null) {
        res.status(403);
        res.end('');
        return;
      } else {
        user = 'manager';
        userID = manager.id;
      }
    } else {
      user = 'investor';
      userID = investor.id;
    }
    const request = await Request.findOne({[user]: userID, id: req.params.id});
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    if (!investor)
      investor = await Investor.findOne({id: request.investor});
    if (!manager)
      manager = await Manager.findOne({id: request.manager});
    res.send({request, investor, manager});
    res.status(200);
    res.end();
  });
  app.post('/api/requests', async (req, res, next) => {
    console.log(req.body);

    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.status(403);
      res.end('');
      return;
    }
    let user;
    let userID;
    let manager;
    const investor = await Investor.findOne({user: token.user});
    if (investor === null) {
      manager = await Manager.findOne({user: token.user});
      if (manager === null) {
        res.status(403);
        res.end('');
        return;
      } else {
        user = 'manager';
        userID = manager.id;
      }
    } else {
      user = 'investor';
      userID = investor.id;
    }
    const requests = await Request.find({[user]: userID});
    res.send(requests);
    res.status(200);
    res.end();
  });
  app.post('/api/decline-request/:id', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.status(403);
      res.end('');
      return;
    }
    let user;
    let userID;
    let manager;
    const investor = await Investor.findOne({user: token.user});
    if (investor === null) {
      manager = await Manager.findOne({user: token.user});
      if (manager === null) {
        res.status(403);
        res.end('');
        return;
      } else {
        user = 'manager';
        userID = manager.id;
      }
    } else {
      user = 'investor';
      userID = investor.id;
    }
    const request = await Request.findOne({[user]: userID, id: req.body.request});
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    request.set({status: 'declined'});
    await request.save();
    res.status(200);
    res.end();
  });
  app.post('/api/pending-request/:id', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.status(403);
      res.end('');
      return;
    }
    const  manager = await Manager.findOne({user: token.user});
    if (manager === null) {
      res.status(403);
      res.end('');
    }
    const request = await Request.findOne({manager: manager.id, id: req.params.id});
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    const portfolio = await Portfolio.findOne({manager: manager.id, id: req.params.id});
    if (portfolio === null) {
      res.status(403);
      res.end('');
      return;
    }
    console.log(request);
    request.set({status: 'pending'});
    console.log(request);
    await request.save();
    res.status(200);
    res.end();
  });
}
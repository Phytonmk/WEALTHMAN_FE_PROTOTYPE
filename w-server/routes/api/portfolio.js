const Token = require('../../models/accessToken');
const Investor = require('../../models/Investor');
const Manager = require('../../models/Manager');
const Request = require('../../models/Request');
const Portfolio = require('../../models/Portfolio');

module.exports = (app) => {
  app.post('/api/portfolio/save', async (req, res, next) => {
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
      return;
    }
    const request = await Request.findOne({id: req.body.request});
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    const portfolioID = await Portfolio.countDocuments({});
    const portfolio = new Portfolio({
      id: portfolioID,
      request: request.id,
      manager: manager.id,
      currencies: req.body.currencies
    });
    await portfolio.save();
    res.status(200);
    res.end();
  });
  app.post('/api/portfolio/load', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    console.log('-');
    if (token === null) {
      res.status(403);
      res.end('');
      return;
    }
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
    const request = await Request.findOne({id: req.body.request, [user]: userID});
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    const portfolio = await Portfolio.findOne({request: request.id});
    if (portfolio === null) {
      res.send({exists: false})
    } else {
      res.send({exists: true, portfolio});
    }
    res.status(200);
    res.end();
  });
  // app.post('/api/get-request/:id', async (req, res, next) => {
  //   const token = await Token.findOne({token: req.body.accessToken});
  //   if (token === null) {
  //     res.status(403);
  //     res.end('');
  //     return;
  //   }
  //   let user;
  //   let userID;
  //   let manager;
  //   const investor = await Investor.findOne({user: token.user});
  //   if (investor === null) {
  //     manager = await Manager.findOne({user: token.user});
  //     if (manager === null) {
  //       res.status(403);
  //       res.end('');
  //       return;
  //     } else {
  //       user = 'manager';
  //       userID = manager.id;
  //     }
  //   } else {
  //     user = 'investor';
  //     userID = investor.id;
  //   }
  //   console.log({[user]: userID, id: req.params.id});
  //   const request = await Request.findOne({[user]: userID, id: req.params.id});
  //   if (request === null) {
  //     res.status(404);
  //     res.end('');
  //     return;
  //   }
  //   res.send(request);
  //   res.status(200);
  //   res.end();
  // });
  // app.post('/api/requests', async (req, res, next) => {
  //   console.log(req.body);

  //   const token = await Token.findOne({token: req.body.accessToken});
  //   if (token === null) {
  //     res.status(403);
  //     res.end('');
  //     return;
  //   }
  //   let user;
  //   let userID;
  //   let manager;
  //   const investor = await Investor.findOne({user: token.user});
  //   if (investor === null) {
  //     manager = await Manager.findOne({user: token.user});
  //     if (manager === null) {
  //       res.status(403);
  //       res.end('');
  //       return;
  //     } else {
  //       user = 'manager';
  //       userID = manager.id;
  //     }
  //   } else {
  //     user = 'investor';
  //     userID = investor.id;
  //   }
  //   const requests = await Request.find({[user]: userID});
  //   res.send(requests);
  //   res.status(200);
  //   res.end();
  // });
  // app.post('/api/decline-request/:id', async (req, res, next) => {
  //   const token = await Token.findOne({token: req.body.accessToken});
  //   if (token === null) {
  //     res.status(403);
  //     res.end('');
  //     return;
  //   }
  //   let user;
  //   let userID;
  //   let manager;
  //   const investor = await Investor.findOne({user: token.user});
  //   if (investor === null) {
  //     manager = await Manager.findOne({user: token.user});
  //     if (manager === null) {
  //       res.status(403);
  //       res.end('');
  //       return;
  //     } else {
  //       user = 'manager';
  //       userID = manager.id;
  //     }
  //   } else {
  //     user = 'investor';
  //     userID = investor.id;
  //   }
  //   const request = await Request.findOne({[user]: userID, id: req.params.id});
  //   if (request === null) {
  //     res.status(404);
  //     res.end('');
  //     return;
  //   }
  //   request.set({status: 'declined'});
  //   await request.save();
  //   res.status(200);
  //   res.end();
  // })
}
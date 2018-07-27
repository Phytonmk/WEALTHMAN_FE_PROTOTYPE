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
    if (request.status === 'pending') {
      request.set({
        exit_fee: req.body.fees.exit_fee,
        managment_fee: req.body.fees.managment_fee,
        perfomance_fee: req.body.fees.perfomance_fee,
        front_fee: req.body.fees.front_fee,
      });
    }
    const existsPortfolio = await Portfolio.findOne({request: request.id, state: 'draft'});
    if (existsPortfolio === null) {
      const portfolioID = await Portfolio.countDocuments({});
      const portfolio = new Portfolio({
        id: portfolioID,
        request: request.id,
        manager: request.manager,
        investor: request.investor,
        currencies: req.body.currencies,
        state: 'draft'
      });
      await portfolio.save();
    } else {
      existsPortfolio.set({currencies: req.body.currencies});
      await existsPortfolio.save();
    }
    if (request.status === 'pending')
      await request.save();
    res.status(200);
    res.end();
  });
  app.post('/api/portfolio/load', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
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
    let portfolio = await Portfolio.findOne({request: request.id, state: (req.body.state ? req.body.state : 'active')});
    if (portfolio === null)
      portfolio = await Portfolio.findOne({request: request.id, state: 'draft'});
    if (portfolio === null) {
      res.send({exists: false})
    } else {
      res.send({exists: true, portfolio});
    }
    res.status(200);
    res.end();
  });
  app.post('/api/portfolio/load-draft', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
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
    const activePortfolio = await Portfolio.findOne({request: request.id, state: 'active'});
    let portfolio = await Portfolio.findOne({request: request.id, state: 'draft'});
    let activeExists = false;
    if (portfolio === null) {
      portfolio = activePortfolio;
    } else {
      activeExists = true
    }
    if (portfolio === null) {
      if (activePortfolio) {
        const portfolioID = await Portfolio.countDocuments({});
        portfolio = portfolio.toObject();
        portfolio.state = 'draft';
        portfolio._id = undefined;
        portfolio = new Portfolio(portfolio);
        await portfolio.save();
        res.send({exists: true, portfolio, activeExists});
      } else {
        res.send({exists: false})
      }
    } else {
      res.send({exists: true, portfolio, activeExists});
    }
    res.status(200);
    res.end();
  });
  app.post('/api/portfolios/load', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
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
    const portfolios = await Portfolio.find({[user]: userID, state: 'active'});
    const requests = await Request.find({[user]: userID, type: 'portfolio'});
    if (portfolios.length === 0) {
      res.send({exists: false})
    } else {
      res.send({exists: true, portfolios, requests});
    }
    res.status(200);
    res.end();
  });
  app.post('/api/portfolio/propose/:request', async (req, res, next) => {
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
    const request = await Request.findOne({manager: manager.id, id: req.params.request, status: 'pending'});
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    const portfolio = await Portfolio.findOne({manager: manager.id, request: request.id});
    if (portfolio === null) {
      res.status(403);
      res.end('');
      return;
    }
    request.set({status: 'proposed'});
    await request.save();
    res.status(200);
    res.end();
  });
  app.post('/api/portfolio/review/:request', async (req, res, next) => {
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
    const request = await Request.findOne({manager: manager.id, id: req.params.request});
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    const portfolio = await Portfolio.findOne({manager: manager.id, request: request.id});
    if (portfolio === null) {
      res.status(403);
      res.end('');
      return;
    }
    if (request.service !== 'Robo-advisor' && request.revisions_amount < request.revisions) {
      res.status(406);
      res.end('');
      return; 
    }
    if (request.service === 'Discretionary') {
      request.set({revisions: request.revisions + 1});
      await updatePortfoliosState({manager: manager.id, request: request.id});
      request.set({status: 'recalculated'});
    } else if (request.service === 'Advisory') {
      request.set({status: 'revision'});
    } else {
      request.set({status: 'recalculated'});
      request.set({revisions: request.revisions + 1});
      await updatePortfoliosState({manager: manager.id, request: request.id});
    }
    await request.save();
    res.status(200);
    res.end();
  });
  app.post('/api/portfolio/accept-review/:request', async (req, res, next) => {
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
    }
    const request = await Request.findOne({investor: investor.id, id: req.params.request, status: 'revision'});
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    const portfolio = await Portfolio.findOne({investor: investor.id, request: request.id});
    if (portfolio === null) {
      res.status(403);
      res.end('');
      return;
    }
    request.set({revisions: request.revisions + 1});
    await updatePortfoliosState({investor: investor.id, request: request.id})
    request.set({status: 'recalculated'});
    await request.save();
    res.status(200);
    res.end();
  });
  app.post('/api/portfolio/decline-review/:request', async (req, res, next) => {
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
    }
    const request = await Request.findOne({investor: investor.id, id: req.params.request, status: 'revision'});
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    const portfolio = await Portfolio.findOne({investor: investor.id, request: request.id});
    if (portfolio === null) {
      res.status(403);
      res.end('');
      return;
    }
    request.set({status: 'active'});
    await request.save();
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

const updatePortfoliosState = (searchQuery) => new Promise(async (resolve, reject) => {
  const oldActivePortfolio = await Portfolio.findOne(Object.assign(searchQuery, {state: 'active'}));
  const newActivePortfolio = await Portfolio.findOne(Object.assign(searchQuery, {state: 'draft'}));
  newActivePortfolio.set({state: 'active'});
  if (oldActivePortfolio !== null) {
    newActivePortfolio.set({smart_contract: oldActivePortfolio.smart_contract}); 
    oldActivePortfolio.set({state: 'old'});
    await oldActivePortfolio.save();
  }
  await newActivePortfolio.save();
  resolve();
});
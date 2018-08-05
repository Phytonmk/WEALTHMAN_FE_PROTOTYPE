const Token = require('../../models/accessToken');
const Investor = require('../../models/Investor');
const Manager = require('../../models/Manager');
const Request = require('../../models/Request');
const Portfolio = require('../../models/Portfolio');

const notify = require('../../helpers/notifications')

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
    let request = await Request.findById(req.body.request);
    if (request === null) {
      const investor = await Investor.findById(req.body.investor) //check if he is client (403)
      if (investor === null) {
        res.status(404);
        res.end('');
        return;
      }
      request = new Request({
        initiatedByManager: true,
        investing_reason: 'Not specified',
        manager: manager._id,
        investor: req.body.investor,
        value: req.body.value,
        comment: req.body.comment,
        period: req.body.period,
        status: 'pending',
        max_deviation: req.body.max_deviation,
        commissions_frequency: req.body.commissions_frequency
      })
      // res.status(404);
      // res.end('');
      // return;
    }
    if (request.status === 'pending') {
      request.set({
        exit_fee: req.body.fees.exit_fee,
        managment_fee: req.body.fees.managment_fee,
        perfomance_fee: req.body.fees.perfomance_fee,
        front_fee: req.body.fees.front_fee,
        max_deviation: req.body.max_deviation,
        commissions_frequency: req.body.commissions_frequency
      });
    }
    const existsPortfolio = await Portfolio.findOne({request: request._id, state: 'draft'});
    if (existsPortfolio === null) {
      const portfolio = new Portfolio({
        request: request._id,
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
    res.send(request._id);
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
        userID = manager._id;
      }
    } else {
      user = 'investor';
      userID = investor._id;
    }
    const request = await Request.findById(req.body.request);
    if (request === null || request.user === userID) {
      res.status(404);
      res.end('');
      return;
    }
    let portfolio = await Portfolio.findOne({request: request._id, state: (req.body.state ? req.body.state : 'active')});
    if (portfolio === null)
      portfolio = await Portfolio.findOne({request: request._id, state: 'draft'});
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
        userID = manager._id;
      }
    } else {
      user = 'investor';
      userID = investor._id;
    }
    const request = await Request.findById(req.body.request);
    if (request === null || request.user !== userID) {
      res.status(404);
      res.end('');
      return;
    }
    const activePortfolio = await Portfolio.findOne({request: request._id, state: 'active'});
    let portfolio = await Portfolio.findOne({request: request._id, state: 'draft'});
    let activeExists = false;
    if (portfolio === null) {
      portfolio = activePortfolio;
    } else {
      activeExists = true
    }
    if (portfolio === null) {
      if (activePortfolio) {
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
        userID = manager._id;
      }
    } else {
      user = 'investor';
      userID = investor._id;
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
    const request = await Request.findOne({manager: manager._id, _id: req.params.request, status: 'pending'});
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    const portfolio = await Portfolio.findOne({manager: manager._id, request: request._id});
    if (portfolio === null) {
      res.status(403);
      res.end('');
      return;
    }
    request.set({status: 'proposed'});
    await request.save();
    await notify({request: request._id, title: `Manager proposed portfolio`})
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
    const request = await Request.findOne({manager: manager._id, _id: req.params.request});
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    const portfolio = await Portfolio.findOne({manager: manager._id, request: request._id});
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
      await updatePortfoliosState({manager: manager._id, request: request._id});
      request.set({status: 'recalculated'});
      await notify({request: request._id, title: `Portfolio waiting for system recalculation`})
    } else if (request.service === 'Advisory') {
      request.set({status: 'revision'});
      await notify({request: request._id, title: `Portfolio waiting for manager revision`})
    } else {
      request.set({status: 'recalculated'});
      request.set({revisions: request.revisions + 1});
      await notify({request: request._id, title: `Portfolio waiting for system recalculation`})
      await updatePortfoliosState({manager: manager._id, request: request._id});
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
    const request = await Request.findOne({investor: investor._id, _id: req.params.request, status: 'revision'});
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    const portfolio = await Portfolio.findOne({investor: investor._id, request: request._id});
    if (portfolio === null) {
      res.status(403);
      res.end('');
      return;
    }
    request.set({revisions: request.revisions + 1});
    await updatePortfoliosState({investor: investor._id, request: request._id})
    request.set({status: 'recalculated'});
    await request.save();
    await notify({request: request._id, title: `Portfolio waiting for system recalculation`})
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
    const request = await Request.findOne({investor: investor._id, _id: req.params.request, status: 'revision'});
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    const portfolio = await Portfolio.findOne({investor: investor._id, request: request._id});
    if (portfolio === null) {
      res.status(403);
      res.end('');
      return;
    }
    request.set({status: 'active'});
    await request.save();
    await notify({request: request._id, title: `New portfolio declined`})
    res.status(200);
    res.end();
  });
  app.post('/api/portfolio/request-another/:request', async (req, res, next) => {
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
    const request = await Request.findOne({investor: investor._id, _id: req.params.request, status: 'proposed'});
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    request.set({status: 'pending'});
    await request.save();
    await notify({request: request._id, title: `Intesor requested another portfolio`})
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
  //       userID = manager._id;
  //     }
  //   } else {
  //     user = 'investor';
  //     userID = investor._id;
  //   }
  //   console.log({[user]: userID, _id: req.params._id});
  //   const request = await Request.findOne({[user]: userID, _id: req.params._id});
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
  //       userID = manager._id;
  //     }
  //   } else {
  //     user = 'investor';
  //     userID = investor._id;
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
  //       userID = manager._id;
  //     }
  //   } else {
  //     user = 'investor';
  //     userID = investor._id;
  //   }
  //   const request = await Request.findOne({[user]: userID, _id: req.params._id});
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
const Token = require('../../models/accessToken');
const User = require('../../models/User');
const Manager = require('../../models/Manager');
const Investor = require('../../models/Investor');
const Request = require('../../models/Request');
const Company = require('../../models/Company');

module.exports = (app) => {
  app.post('/api/investors-list', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.status(403);
      res.end();
      return;
    }
    // let userType;
    // let userId;
    // const manager = await Manager.findOne({user: token.user});
    // if (manager === null) {
    //   const company = await Company.findOne({user: token.user});
    //   if (company === null) {
    //     res.status(403);
    //     res.end();
    //     return;
    //   }
    //   userType = 'company';
    //   userId = company.id;
    // } else {
    //   userType = 'manager';
    //   userId = manager.id;
    // }
    // const investorsIds = [];
    // const requests = await Request.find({[userType]: userId})
    // const requests = await Request.find({[userType]: userId})
    // for (let request of requests) {
    //   if (request.investor !== null && !investorsIds.includes(request.investor))
    //     investorsIds.push(request.investor);
    // }
    // const investors = [];
    // for (let investorId of investorsIds) {
    //   const investor = await Investor.findById(investorId);
    //   if (investor !== null)
    //     investors.push(investor);
    // }
    const investors = await Investor.find()
    res.send(investors);
    res.end();
  });
  app.get('/api/investor/:id', async (req, res, next) => {
    const investor = await Investor.findById(req.params.id);
    if (investor === null) {
      res.status(404);
      res.end();
      return;
    }
    res.send(investor);
    res.end();
  });
  app.post('/api/withdraw/:request', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.status(403);
      res.end();
      return;
    }
    const investor = await Investor.findOne({user: token.user});
    if (investor === null) {
      res.status(403);
      res.end();
      return;
    }
    // withdrawing...
    res.send(investor);
    res.end();
  });
  // app.get('/api/investor-statistics/:id', async (req, res, next) => {
  //   console.log(req.params.id);
  //   const investor = await Investor.findById(req.params.id);
  //   if (investor === null) {
  //     res.status(404);
  //     res.end();
  //     return;
  //   }
  //   const profitability = Math.ceil(Math.random() * 100);
  //   const clients = Math.ceil(Math.random() * 100);
  //   const portfolios = Math.ceil(Math.random() * 100);
  //   res.status(200);
  //   res.send({
  //     profitability,
  //     clients,
  //     portfolios
  //   });
  //   res.end();
  // });
  app.get('/api/my-clients', async (req, res, next) => {
    const token = await Token.findOne({token: req.headers.accesstoken})
    if (token === null) {
      res.sendStatus(403)
      res.end()
      return
    }
    const user = await User.findById(token.user)
    if (user === null) {
      res.sendStatus(403)
      res.end()
      return
    }
    let userType = null
    if (user.type === 1)
      userType = 'manager'
    else if (user.type === 1)
      userType = 'company'
    if (userType === null) {
      res.sendStatus(403)
      res.end()
      return
    }
    const userRoleAccount = await (userType === 'manager' ? Manager : Company).findOne({user: user._id}) 
    const roleId = userRoleAccount._id
    const requests = await Request.find({[userType]: roleId, type: 'portfolio'})
    const result = []
    for (let request of requests) {
      result.push(request.investor)
    }
    res.send(result)
    res.end()
  })
} 
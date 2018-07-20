const Token = require('../../models/accessToken');
const Investor = require('../../models/Investor');
const Manager = require('../../models/Manager');
const Company = require('../../models/Company');
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
    let managerType;
    let managerId;
    if (req.body.manager) {
      const manager = await Manager.findOne({id: req.body.manager});
      if (manager === null) {
        res.status(403);
        res.end('');
        return;
      }
      managerType = 'manager';
      managerId = manager.id;
    } else if (req.body.company) {
      const company = await Company.findOne({id: req.body.company});
      if (company === null) {
        res.status(403);
        res.end('');
        return;
      }
      managerType = 'company';
      managerId = company.id;
    } else {
      res.status(403);
      res.end('');
      return;
    }
    if ((!req.body.type || req.body.type === 'portfolio') && !['Robo-advisor', 'Discretionary', 'Advisory'].includes(req.body.service)) {
      res.status(406);
      res.end('');
      return;
    }
    if (req.body.revisions) {
      res.status(406);
      res.end('');
      return;      
    }
    const requestID = await Request.countDocuments({});
    const request = new Request({
      id: requestID,
      investor: investor.id,
      [managerType]: managerId,
      value: req.body.value,
      comment: req.body.comment,
      service: req.body.service,
      options: {
        analysis: req.body.options.analysis,
        comment: req.body.options.manager_comment
      }
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
    const requestQuery = await getRequestQueryByToken(token)
      .catch((err) => {
        res.status(err);
        res.end();
      });
    const request = await Request.findOne(Object.assign(requestQuery, {id: req.params.id}));
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    const investor = await Investor.findOne({id: request.investor});
    const manager = await Manager.findOne({id: request.manager});
    const company = await Company.findOne({id: request.company});
    const portfolio = await Portfolio.findOne({request: request.id});
    res.send({request, investor, manager, company, portfolio});
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
    const requestQuery = await getRequestQueryByToken(token)
      .catch((err) => {
        res.status(err);
        res.end();
      });
    const requests = await Request.find(requestQuery);
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
    const requestQuery = await getRequestQueryByToken(token)
      .catch((err) => {
        res.status(err);
        res.end();
      });
    const request = await Request.findOne(Object.assign(requestQuery, {id: req.body.request}));
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
  // app.post('/api/pending-request/:id', async (req, res, next) => {
  //   const token = await Token.findOne({token: req.body.accessToken});
  //   if (token === null) {
  //     res.status(403);
  //     res.end('');
  //     return;
  //   }
  //   console.log('-')
  //   const  manager = await Manager.findOne({user: token.user});
  //   if (manager === null) {
  //     res.status(403);
  //     res.end('');
  //   }
  //   const request = await Request.findOne({manager: manager.id, id: req.params.id});
  //   if (request === null) {
  //     res.status(404);
  //     res.end('');
  //     return;
  //   }
  //   console.log('-')
  //   const portfolio = await Portfolio.findOne({manager: manager.id, request: req.params.id});
  //   if (portfolio === null) {
  //     res.status(403);
  //     res.end('');
  //     return;
  //   }
  //   request.set({status: 'pending'});
  //   await request.save();
  //   res.status(200);
  //   res.end();
  // });
  app.post('/api/requests/relay-to-manager', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.status(403);
      res.end('');
      return;
    }
    const  company = await Company.findOne({user: token.user});
    if (company === null) {
      res.status(403);
      res.end('');
    }
    const request = await Request.findOne({company: company.id, id: req.body.request});
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    const manager = await Manager.findOne({company: company.id, id: req.body.manager});
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    request.set({company: null, manager: manager.id});
    await request.save();
    res.status(200);
    res.end();
  });
  //
}

const getRequestQueryByToken = (token) => new Promise(async (resolve, reject) => {
  let user;
  let userID;
  let manager;
  let company;
  const investor = await Investor.findOne({user: token.user});
  if (investor === null) {
    manager = await Manager.findOne({user: token.user});
    if (manager === null) {
      company = await Company.findOne({user: token.user});
      if (company === null) {
        reject(403);
        return;
      } else {
        user = 'company';
        userID = company.id;
      }
    } else {
      user = 'manager';
      userID = manager.id;
    }
  } else {
    user = 'investor';
    userID = investor.id;
  }
  resolve({[user]: userID});
});
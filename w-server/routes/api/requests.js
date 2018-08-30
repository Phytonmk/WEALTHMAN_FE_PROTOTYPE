const Token = require('../../models/accessToken');
const Investor = require('../../models/Investor');
const Manager = require('../../models/Manager');
const Company = require('../../models/Company');
const Request = require('../../models/Request');
const Portfolio = require('../../models/Portfolio');
const KYCAnswersForm = require('../../models/KYCAnswersForm');
const Notification = require('../../models/Notification');
const Transaction = require('../../models/Transaction');

const servicesList = ['Robo-advisor', 'Discretionary', 'Advisory'];

const notify = require('../../helpers/notifications')

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
    let services = null;
    if (req.body.manager !== undefined) {
      const manager = await Manager.findById(req.body.manager);
      if (manager === null) {
        res.status(404);
        res.end('');
        return;
      }
      managerType = 'manager';
      managerId = manager.id;
      services = manager.services;
    } else if (req.body.company !== undefined) {
      const company = await Company.findById(req.body.company);
      if (company === null) {
        res.status(404);
        res.end('');
        return;
      }
      managerType = 'company';
      managerId = company.id;
      services = company.services;
    } else {
      res.status(404);
      res.end('');
      return;
    }
    if ((!req.body.type || req.body.type === 'portfolio') && !servicesList.includes(req.body.service)) {
      res.status(406);
      res.end('');
      return;
    }
    if (req.body.revisions) {
      res.status(406);
      res.end('');
      return;
    }

    const selectedService = services.find(service => service.type === servicesList.indexOf(req.body.service))

    let investing_reason = '?'
    
    for (let kycAnswer of req.body.kycAnswers) {
      if (kycAnswer.question === 'What is your primary reason for investing?') {
        investing_reason = kycAnswer.answer
        break
      }
    }

    const request = new Request({
      investor: investor.id,
      [managerType]: managerId,
      value: req.body.value,
      comment: req.body.comment,
      service: req.body.service,
      period: req.body.period,
      options: {
        analysis: req.body.options.analysis,
        comment: req.body.options.manager_comment
      },
      period: req.body.period,
      exit_fee: selectedService.exit_fee,
      managment_fee: selectedService.managment_fee,
      perfomance_fee: selectedService.perfomance_fee,
      front_fee: selectedService.front_fee,
      investing_reason
    });


    // HANDLING
    const riskprofile = Math.ceil(Math.random() * 10);

    // console.log('riskprofile', riskprofile)

    const kycAnswersForm = new KYCAnswersForm({
      request: request.id,
      answers: req.body.kycAnswers
    })
    let last_target = '-'
    for (let step of kycAnswersForm.answers) {
      if (step.question === 'What is your primary reason for investing?') {
        last_target = step.answer
        break
      }
    }
    investor.set({riskprofile, kyc_filled: true, last_target});
    await kycAnswersForm.save();
    await investor.save();
    await request.save();
    await notify({request: request._id, title: 'Request initiated by investor'})
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
    const request = await Request.findOne(Object.assign(requestQuery, {_id: req.params.id}));
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    const investor = await Investor.findById(request.investor);
    const manager = await Manager.findById(request.manager);
    const company = await Company.findById(request.company);
    const portfolio = await Portfolio.findOne({request: request.id/*, state: 'active'*/})
    const transactions = portfolio !== null ? await Transaction.find({
      smart_contract: portfolio.smart_contract
    }) : []
    const oldPortfolios = await Portfolio.find({request: request.id, status: 'old'});
    res.send({request, investor, manager, company, portfolio, oldPortfolios, transactions});
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
    const request = await Request.findOne(Object.assign(requestQuery, {_id: req.body.request}));
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    request.set({status: 'declined'});
    await request.save();
    await notify({request: request._id, title: 'Request declined'})
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
  //   const request = await Request.findOne({manager: manager.id, _id: req.params.id});
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
    const request = await Request.findOne({company: company.id, _id: req.body.request});
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    const manager = await Manager.findOne({company: company.id, _id: req.body.manager});
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    request.set({company: null, manager: manager.id});
    await request.save();
    await notify({request: request._id, title: `Request relayed to manager ${(manager.name || '')} ${(manager.surname || '')}`})
    res.status(200);
    res.end();
  });
  app.get('/api/request/history/:request', async (req, res, next) => {
    const history = await Notification.find({request: req.params.request});
    res.send(history)
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
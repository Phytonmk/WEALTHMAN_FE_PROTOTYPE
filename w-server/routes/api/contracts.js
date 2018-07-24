const Token = require('../../models/accessToken');
const Investor = require('../../models/Investor');
const Manager = require('../../models/Manager');
const Request = require('../../models/Request');
const Portfolio = require('../../models/Portfolio');

const Web3 = require('web3');
const Accounts = require('web3-eth-accounts');

const ABI = require('../../contract_abi');

const addPortfolio = require('../../trading/wealthman_portfolio_add');
const deployContract = require('../../trading/wealthman_deploy');

module.exports = (app) => {
  // app.post('/api/get-smart-contract-data', async (req, res) => {
  //   const token = await Token.findOne({token: req.body.accessToken});
  //   if (token === null) {
  //     res.status(403);
  //     res.end('');
  //     return;
  //   }
  //   const investor = await Investor.findOne({user: token.user});
  //   if (investor === null) {
  //     res.status(403);
  //     res.end('');
  //     return;
  //   }
  //   const request = await Request.findOne({investor: investor.id, id: req.body.request});
  //   if (request === null) {
  //     res.status(403);
  //     res.end('');
  //     return;
  //   }
  //   console.log('-');
  //   const manager = await Manager.findOne({id: request.manager});
  //   if (manager === null) {
  //     res.status(500);
  //     res.end('');
  //     return;
  //   }
  //   const portfolio = await Portfolio.findOne({request: request.id, state: 'draft'});
  //   if (portfolio === null) {
  //     res.status(500);
  //     res.end('');
  //     return;
  //   }
  //   portfolio.set({status: 'pending'});
  //   await portfolio.save();
  //   console.log(manager, manager.wallet_address);
  //   res.send({
  //     manager: manager.wallet_address || 'empty_wallet_address',
  //     investor: investor.wallet_address || 'empty_wallet_address'
  //   });
  //   res.status(200);
  //   res.end();
  // })
  app.post('/api/contracts/deploy', async (req, res) => {
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
    const request = await Request.findOne({investor: investor.id, id: req.body.request});
    if (request === null) {
      res.status(403);
      res.end('');
      return;
    }
    const manager = await Manager.findOne({id: request.manager});
    if (manager === null) {
      res.status(404);
      res.end('');
      return;
    }
    // const portfolio = await Portfolio.findOne({request: request.id, state: 'draft'});
    // if (portfolio === null) {
    //   res.status(500);
    //   res.end('');
    //   return;
    // }
    const services = ['Robo-advisor', 'Discretionary', 'Advisory']
    const fees = manager.services.find(service => service.type === services.indexOf(request.service));
    if (fees === undefined) {
      res.status(500);
      console.log('fees are undefined');
      console.log(manager.services, request.service);
      return;
    }
    const deploying = await deployContract({
      _owner: investor.wallet_address,
      _manager: manager.wallet_address,
      _tradesMaxCount: request.revisions_amount,
      _managmentFee: fees.managment_fee,
      _performanceFee: fees.perfomance_fee,
      _frontFee: fees.front_fee,
      _exitFee: fees.exit_fee,
      _endTime: (new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * request.period).getTime()),
      _mngPayoutPeriod: undefined,
      _prfPayoutPeriod: undefined
    }).catch((err) => {
      res.status(500);
      console.log(err);
    });
    if (!deploying || !deploying.success) {
      res.status(500);
      console.log('unsuccessfull deployment');
    } else {
      request.set({
        deployment_hash: deploying.hash,
        status: 'deploying'
      });
      console.log(request);
      await request.save();
      res.status(200);
      res.end();
    }
  })
  // app.post('/api/set-smart-contract', async (req, res) => {
  //   const token = await Token.findOne({token: req.body.accessToken});
  //   if (token === null) {
  //     res.status(403);
  //     res.end('');
  //     return;
  //   }
  //   const investor = await Investor.findOne({user: token.user});
  //   if (investor === null) {
  //     res.status(403);
  //     res.end('');
  //     return;
  //   }
  //   const request = await Request.findOne({investor: investor.id, id: req.body.request});
  //   if (request === null) {
  //     res.status(403);
  //     res.end('');
  //     return;
  //   }
  //   const portfolio = await Portfolio.findOne({request: request.id, state: 'draft'});
  //   if (portfolio === null) {
  //     res.status(500);
  //     res.end('');
  //     return;
  //   }
  //   request.set({status: 'waiting for deposit'});
  //   await request.save();
  //   portfolio.set({smart_contract: req.body.contractAddress, state: 'active'});
  //   await portfolio.save();
  //   await addPortfolio(req.body.contractAddress);
  //   res.status(200);
  //   res.end();
  // })
  // app.post('/api/portfolio-formating', async (req, res) => {
  //   const token = await Token.findOne({token: req.body.accessToken});
  //   if (token === null) {
  //     res.status(403);
  //     res.end('');
  //     return;
  //   }
  //   const investor = await Investor.findOne({user: token.user});
  //   if (investor === null) {
  //     res.status(403);
  //     res.end('');
  //     return;
  //   }
  //   const request = await Request.findOne({investor: investor.id, id: req.body.request});
  //   if (request === null) {
  //     res.status(403);
  //     res.end('');
  //     return;
  //   }
  //   const portfolio = await Portfolio.findOne({request: request.id});
  //   if (portfolio === null) {
  //     res.status(500);
  //     res.end('');
  //     return;
  //   }
    
  //   res.status(200);
  //   res.end();
  // })
  app.get('/api/create-wallet', (req, res) => {
    const web3 = new Web3();
    const accounts = new Accounts("http://rinkeby.infura.io");
    const account = web3.eth.accounts.create();
    res.send(account);
    res.status(200);
    res.end('');
  });
}
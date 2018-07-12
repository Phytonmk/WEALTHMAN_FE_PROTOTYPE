const Token = require('../../models/accessToken');
const Investor = require('../../models/Investor');
const Manager = require('../../models/Manager');
const Request = require('../../models/Request');
const Portfolio = require('../../models/Portfolio');

const Web3 = require('web3');
const Accounts = require('web3-eth-accounts');

const ABI = require('../../contract_abi');

module.exports = (app) => {
  app.post('/api/get-smart-contract-data', async (req, res) => {
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
    console.log('-');
    const manager = await Manager.findOne({id: request.manager});
    if (manager === null) {
      res.status(500);
      res.end('');
      return;
    }
    const portfolio = await Portfolio.findOne({request: request.id});
    if (portfolio === null) {
      res.status(500);
      res.end('');
      return;
    }
    portfolio.set({status: 'pending'});
    await portfolio.save();
    console.log(manager, manager.wallet_address);
    res.send({
      manager: manager.wallet_address || 'empty_wallet_address',
      investor: investor.wallet_address || 'empty_wallet_address'
    });
    res.status(200);
    res.end();
  })
  app.post('/api/set-smart-contract', async (req, res) => {
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
    const portfolio = await Portfolio.findOne({request: request.id});
    if (portfolio === null) {
      res.status(500);
      res.end('');
      return;
    }
    portfolio.set({smart_contract: req.body.contractAddress});
    await portfolio.save();
    res.status(200);
    res.end();
  })
  app.post('/api/portfolio-formating', async (req, res) => {
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
    const portfolio = await Portfolio.findOne({request: request.id});
    if (portfolio === null) {
      res.status(500);
      res.end('');
      return;
    }
    
    res.status(200);
    res.end();
  })
  app.get('/api/create-wallet', (req, res) => {
    const web3 = new Web3();
    const accounts = new Accounts("http://rinkeby.infura.io");
    const account = web3.eth.accounts.create();
    res.send(account);
    res.status(200);
    res.end('');
  });
  app.get('/smart', (req, res) => {
    res.status(200);
    res.end('');

    console.log('SMART CONTRACT');
  });
}
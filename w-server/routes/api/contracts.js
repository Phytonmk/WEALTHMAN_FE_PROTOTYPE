const Token = require('../../models/accessToken');
const Investor = require('../../models/Investor');
const Manager = require('../../models/Manager');
const Request = require('../../models/Request');
const Portfolio = require('../../models/Portfolio');

const Web3 = require('web3');
const Accounts = require('web3-eth-accounts');

const ABI = require('../../trading/contract_abi');

const notify = require('../../helpers/notifications')
const addPortfolio = require('../../trading/wealthman_portfolio_add');
const deployContract = require('../../trading/wealthman_deploy');

module.exports = (app) => {
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
    const deploying = await deployContract({
      _owner: investor.wallet_address,
      _manager: manager.wallet_address,
      _tradesMaxCount: request.revisions_amount,
      _managmentFee: request.managment_fee,
      _performanceFee: request.perfomance_fee,
      _frontFee: request.front_fee,
      _exitFee: request.exit_fee,
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
      await notify(request.id, `Contract deploying started`)
      res.status(200);
      res.end();
    }
  });
  app.post('/api/withdraw-address', async (req, res) => {
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
    const request = await Request.findOne({
      investor: investor.id,
      id: req.body.request
    });
    if (request === null) {
      res.status(404);
      res.end('');
      return;
    }
    if (request.status === 'archived') {
      res.send({alreadyWithdrawed: true});
      res.end();
    } else if (request.status === 'withdrawing') {
      res.send({withdrawingProcess: true});
      res.end();
    } else if (['active', 'waiting for deposit', 'revision', 'recalculated'].includes(request.status)) {
      const portfolio = await Portfolio.findOne({
        request: request.id,
        state: 'active'
      });
      if (portfolio === null) {
        res.status(404);
        res.end('');
        return;
      }
      res.send({mayBeWithdrawed: true, address: portfolio.smart_contract});
      res.end();
    } else {
      res.send('');
      res.end();
    }
  });
  app.get('/api/create-wallet', (req, res) => {
    const web3 = new Web3();
    const accounts = new Accounts("http://rinkeby.infura.io");
    const account = web3.eth.accounts.create();
    res.send(account);
    res.status(200);
    res.end('');
  });
}

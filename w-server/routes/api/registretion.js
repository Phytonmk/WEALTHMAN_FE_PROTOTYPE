const crypto = require('crypto');
const User = require('../../models/User');
const Token = require('../../models/accessToken');
const Investor = require('../../models/Investor');
const Manager = require('../../models/Manager');
const Company = require('../../models/Company');

const salt = 'super salt';

const genToken = (user) => {
  const token = 
    crypto.createHash('md5')
    .update(
      salt +
      user.id +
      salt +
      (new Date).getTime() +
      salt +
      user.password_hash +
      salt
    ).digest("hex");
  return token;
}

module.exports = (app) => {
  app.post('/api/register', async (req, res, next) => {
    console.log(req.cookies);
    console.log(req.body);
    if (!req.body.login || !req.body.password) {
      res.status(500);
      res.end();
      return;
    }
    const userID = await User.countDocuments({});
    const user = new User({
      id: userID,
      login: req.body.login,
      password_hash: crypto.createHash('md5').update(salt + req.body.password + salt).digest("hex"),
    });
    await user.save();
    const tokenID = await Token.countDocuments({});
    const token = genToken(user);
    const accessToken = new Token({
      id: tokenID,
      user: user.id,
      token
    });
    await accessToken.save();
    res.send(token);
    res.status(200);
    res.end();
  });
  app.post('/api/investor/agree', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.status(403);
      res.end('');
      return
    }
    const user = await User.findOne({id: token.user});
    if (user === null) {
      res.status(500);
      res.end();
      return;
    }
    user.set({agreed: true, type: 0});
    await user.save();
    const investorID = await Investor.countDocuments({});
    const investor = new Investor({user: user.id, id: investorID});
    await investor.save();
    res.status(200);
    res.end();
  });
  app.post('/api/investor/risk', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.status(403);
      res.end('');
      return
    }
    const investor = await Investor.findOne({user: token.user});
    if (investor === null) {
      res.status(500);
      res.end();
      return;
    }

    // HANDLING
    const riskprofile = Math.ceil(Math.random() * 10);

    investor.set({riskprofile});
    await investor.save();
    res.status(200);
    res.end();
  });
  app.post('/api/investor/data', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.status(403);
      res.end('');
      return
    }
    const investor = await Investor.findOne({user: token.user});
    if (investor === null) {
      res.status(500);
      res.end();
      return;
    }
    investor.set(req.body);
    await investor.save();
    res.status(200);
    res.end();
  });
  app.post('/api/manager/data', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.status(403);
      res.end('');
      return;
    }
    const user = await User.findOne({id: token.user});
    if (user === null) {
      res.status(500);
      res.end();
      return;
    }
    user.set({type: 1});
    await user.save();
    const managerID = await Manager.countDocuments({});
    const manager = new Manager(Object.assign(req.body, {user: user.id, id: managerID}));
    await manager.save();
    res.status(200);
    res.end();
  });
  app.post('/api/company/data', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.status(403);
      res.end('');
      return;
    }
    const user = await User.findOne({id: token.user});
    if (user === null) {
      res.status(500);
      res.end();
      return;
    }
    user.set({type: 1});
    await user.save();
    const companyID = await Company.countDocuments({});
    const company = new Company(Object.assign(req.body, {user: user.id, id: companyID}));
    await company.save();
    res.status(200);
    res.end();
  });
  app.post('/api/login', async (req, res, next) => {
    const user = await User.findOne({
      login: req.body.login,
      password_hash: crypto.createHash('md5').update(salt + req.body.password + salt).digest("hex")
    });
    if (user === null) {
      res.status(403);
      res.end();
      return;
    }
    const token = await Token.findOne({user: user.id});
    res.send({accessToken: token.token, usertype: user.type});
    res.status(200);
    res.end();
  });
  app.post('/api/getme', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.status(403);
      res.end('');
      return
    }
    const user = await User.findOne({id: token.user});
    if (user === null) {
      res.status(500);
      res.end();
      return;
    }
    let userData = {};
    switch (user.type) {
      case 0:
        userData = await Investor.findOne({user: user.id});
        break;
    }
    res.send({usertype: user.type, userData});
    res.status(200);
    res.end();
  });
}
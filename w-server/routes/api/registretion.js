const crypto = require('crypto');
const User = require('../../models/User');
const Token = require('../../models/accessToken');
const Investor = require('../../models/Investor');
const Manager = require('../../models/Manager');
const Company = require('../../models/Company');
const fs = require('fs-extra');

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
    const foundManager = await Manager.findOne({user: user.id});
    if (foundManager === null) {
      const manager = new Manager(Object.assign(req.body, {user: user.id, id: managerID}));
      await manager.save();
    } else {
      await Manager.findOneAndUpdate({user: user.id}, req.body);
    }
    res.status(200);
    res.end();
  });
  app.post('/api/photo/investor', async (req, res, next) => {
    console.log(req.headers);
    const token = await Token.findOne({token: req.headers.accesstoken});
    if (token === null) {
      res.status(403);
      res.end('');
      return;
    }
    const investor = await Investor.findOne({user: token.user});
    if (!req.files)
      return res.status(400).send('No files were uploaded.');
    const file = req.files.file;
    await fs.ensureDir(__dirname+ '/../../img/investors/');
    req.files.file.mv(__dirname+ '/../../img/investors/' + investor.id + '.png', async (err) => {
      if (err)
        return res.status(500).send(err);
      res.send('investors/' + investor.id + '.png');
      res.status(200);
      investor.set({img: 'investors/' + investor.id + '.png'});
      await investor.save();
      res.end();
    });
  });
  app.post('/api/photo/manager', async (req, res, next) => {
    console.log(req.headers);
    const token = await Token.findOne({token: req.headers.accesstoken});
    if (token === null) {
      res.status(403);
      res.end('');
      return;
    }
    let manager = await Manager.findOne({user: token.user});
    if (manager === null) {
      const managerID = await Manager.countDocuments({});
      manager = new Manager(Object.assign(req.body, {user: token.user, id: managerID}));
    }
    if (!req.files)
      return res.status(400).send('No files were uploaded.');
    const file = req.files.file;
    await fs.ensureDir(__dirname+ '/../../img/managers/');
    req.files.file.mv(__dirname+ '/../../img/managers/' + manager.id + '.png', async (err) => {
      if (err)
        return res.status(500).send(err);
      res.send('managers/' + manager.id + '.png');
      res.status(200);
      manager.set({img: 'managers/' + manager.id + '.png'});
      await manager.save();
      res.end();
    });
  });
  app.post('/api/photo/company', async (req, res, next) => {
    console.log(req.headers);
    const token = await Token.findOne({token: req.headers.accesstoken});
    if (token === null) {
      res.status(403);
      res.end('');
      return;
    }
    let company = await Company.findOne({user: token.user});
    if (company === null) {
      const companyID = await Company.countDocuments({});
      const company = new Company(Object.assign(req.body, {user: token.user, id: companyID}));
    }
    if (!req.files)
      return res.status(400).send('No files were uploaded.');
    const file = req.files.file;
    await fs.ensureDir(__dirname+ '/../../img/companies/');
    req.files.file.mv(__dirname+ '/../../img/companies/' + company.id + '.png', async (err) => {
      if (err)
        return res.status(500).send(err);
      res.send('companies/' + company.id + '.png');
      res.status(200);
      company.set({img: 'companies/' + company.id + '.png'});
      await company.save();
      res.end();
    });
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
    const foundCompany = await Company.findOne({user: user.id});
    if (foundCompany === null) {
      const company = new Company(Object.assign(req.body, {user: user.id, id: companyID}));
      await company.save();
    } else {
      await Company.findOneAndUpdate({user: user.id}, req.body);
    }
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
    const tokenID = await Token.countDocuments({});
    const token = genToken(user);
    const accessToken = new Token({
      id: tokenID,
      user: user.id,
      token
    });
    await accessToken.save();
    console.log('login ok');
    res.send({accessToken: accessToken.token, usertype: user.type});
    res.status(200);
    res.end();
  });
  app.post('/api/logout', async (req, res, next) => {
    await Token.findOneAndRemove({token: req.body.accessToken});
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
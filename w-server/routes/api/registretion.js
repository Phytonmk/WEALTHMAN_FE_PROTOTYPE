const crypto = require('crypto');
const User = require('../../models/User');
const Token = require('../../models/accessToken');
const Investor = require('../../models/Investor');
const Manager = require('../../models/Manager');
const Company = require('../../models/Company');
const AnswersForm = require('../../models/AnswersForm');
const KYCAnswersForm = require('../../models/KYCAnswersForm');
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

const password_hash = (password) => crypto.createHash('md5').update(salt + password + salt).digest("hex")

module.exports = (app) => {
  app.post('/api/register', async (req, res, next) => {
    console.log(req.cookies);
    console.log(req.body);
    if (!req.body.login || !req.body.password) {
      res.sendStatus(500);
      res.end();
      return;
    }
    const user = new User({
      login: req.body.login,
      password_hash: password_hash(req.body.password),
    });
    await user.save();
    const token = genToken(user);
    const accessToken = new Token({
      user: user.id,
      token
    });
    await accessToken.save();
    res.send(token);
    res.end();
  });
  app.post('/api/investor/agree', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.sendStatus(403);
      res.end('');
      return
    }
    const user = await User.findById(token.user);
    if (user === null) {
      res.sendStatus(500);
      res.end();
      return;
    }
    user.set({agreed: true, type: 0});
    await user.save();
    const investor = new Investor({user: user.id});
    await investor.save();
    res.sendStatus(200);
    res.end();
  });
  app.post('/api/investor/risk', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.sendStatus(403);
      res.end('');
      return
    }
    const investor = await Investor.findOne({user: token.user});
    if (investor === null) {
      res.sendStatus(500);
      res.end();
      return;
    }

    // HANDLING
    // const riskprofile = Math.ceil(Math.random() * 10);

    // console.log('riskprofile', riskprofile)

    const answersForm = new AnswersForm({
      user: token.user,
      answers: req.body.answers
    })
    await answersForm.save();
    // investor.set({riskprofile});
    // await investor.save();
    // res.send(riskprofile.toString());
    res.status(200);
    res.end()
  });
  app.post('/api/investor/data', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.sendStatus(403);
      res.end('');
      return
    }
    const investor = await Investor.findOne({user: token.user});
    if (investor === null) {
      res.sendStatus(500);
      res.end();
      return;
    }
    investor.set(req.body);
    await investor.save();
    res.sendStatus(200);
    res.end();
  });
  app.post('/api/manager/data', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.sendStatus(403);
      res.end('');
      return;
    }
    const user = await User.findOne({__id: token.user});
    if (user === null) {
      res.sendStatus(500);
      res.end();
      return;
    }
    user.set({type: 1});
    await user.save();
    const foundManager = await Manager.findOne({user: user.id});
    if (foundManager === null) {
      const manager = new Manager(Object.assign(req.body, {user: user.id}));
      await manager.save();
    } else {
      await Manager.findOneAndUpdate({user: user.id}, req.body);
    }
    res.sendStatus(200);
    res.end();
  });
  app.post('/api/photo/investor', async (req, res, next) => {
    console.log(req.headers);
    const token = await Token.findOne({token: req.headers.accesstoken});
    if (token === null) {
      res.sendStatus(403);
      res.end('');
      return;
    }
    const investor = await Investor.findOne({user: token.user});
    if (!req.files)
      return res.sendStatus(400).send('No files were uploaded.');
    const file = req.files.file;
    await fs.ensureDir(__dirname+ '/../../img/investors/');
    req.files.file.mv(__dirname+ '/../../img/investors/' + investor.id + '.png', async (err) => {
      if (err)
        return res.sendStatus(500).send(err);
      investor.set({img: 'investors/' + investor.id + '.png'});
      await investor.save();
      res.send('investors/' + investor.id + '.png');
      res.end();
    });
  });
  app.post('/api/photo/manager', async (req, res, next) => {
    console.log(req.headers);
    const token = await Token.findOne({token: req.headers.accesstoken});
    if (token === null) {
      res.sendStatus(403);
      res.end('');
      return;
    }
    let manager = await Manager.findOne({user: token.user});
    if (manager === null) {
      manager = new Manager(Object.assign(req.body, {user: token.user}));
    }
    if (!req.files) {
      res.sendStatus(400).send('No files were uploaded.');
      return;
    }
    const file = req.files.file;
    await fs.ensureDir(__dirname+ '/../../img/managers/');
    req.files.file.mv(__dirname+ '/../../img/managers/' + manager.id + '.png', async (err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);;
        return;
      }
      manager.set({img: 'managers/' + manager.id + '.png'});
      await manager.save();
      res.send('managers/' + manager.id + '.png');
      res.end();
    });
  });
  app.post('/api/photo/company', async (req, res, next) => {
    console.log(req.headers);
    const token = await Token.findOne({token: req.headers.accesstoken});
    if (token === null) {
      res.sendStatus(403);
      res.end('');
      return;
    }
    let company = await Company.findOne({user: token.user});
    if (company === null) {
      company = new Company(Object.assign(req.body, {user: token.user}));
    }
    if (!req.files)
      return res.sendStatus(400).send('No files were uploaded.');
    const file = req.files.file;
    await fs.ensureDir(__dirname+ '/../../img/companies/');
    req.files.file.mv(__dirname+ '/../../img/companies/' + company.id + '.png', async (err) => {
      if (err)
        return res.sendStatus(500).send(err);
      company.set({img: 'companies/' + company.id + '.png'});
      await company.save();
      res.send('companies/' + company.id + '.png');
      res.end();
    });
  });
  app.post('/api/company/data', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.sendStatus(403);
      res.end('');
      return;
    }
    const user = await User.findById(token.user);
    if (user === null) {
      res.sendStatus(500);
      res.end();
      return;
    }
    user.set({type: 3});
    await user.save();
    const foundCompany = await Company.findOne({user: user.id});
    if (foundCompany === null) {
      const company = new Company(Object.assign(req.body, {user: user.id}));
      await company.save();
    } else {
      await Company.findOneAndUpdate({user: user.id}, req.body);
    }
    res.sendStatus(200);
    res.end();
  });
  app.post('/api/login', async (req, res, next) => {
    const user = await User.findOne({
      login: req.body.login,
      password_hash: password_hash(req.body.password)
    });
    if (user === null) {
      res.sendStatus(403);
      console.log(`Wrong login or password:\n${req.body.login}\n${req.body.password}\n${password_hash(req.body.password)}`)
      res.end();
      return;
    }
    const token = genToken(user);
    const accessToken = new Token({
      user: user.id,
      token
    });
    await accessToken.save();
    res.send({accessToken: accessToken.token, usertype: user.type});
    res.end();
  });
  app.post('/api/logout', async (req, res, next) => {
    await Token.findOneAndRemove({token: req.body.accessToken});
    res.sendStatus(200);
    res.end();
  });
  app.post('/api/getme', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.sendStatus(403);
      res.end('');
      return
    }
    const user = await User.findById(token.user);
    if (user === null) {
      res.sendStatus(500);
      res.end();
      return;
    }
    let userData = {};
    switch (user.type) {
      case 0:
        userData = await Investor.findOne({user: user.id});
        break;
      case 1:
        userData = await Manager.findOne({user: user.id});
        break;
      case 3:
        userData = await Company.findOne({user: user.id});
        break;
    }
    user.set({last_request: Date.now()});
    await user.save();
    res.send({usertype: user.type, userData});
    res.end();
  });
  app.post('/api/changepassword', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken});
    if (token === null) {
      res.sendStatus(403);
      res.end('');
      return
    }
    const user = await User.findById(token.user).where({password_hash: password_hash(req.body.old_password)});
    if (user === null) {
      res.sendStatus(403);
      res.end();
      return;
    }
    if (req.body.new_password1 === req.body.new_password2) {
      user.set({password_hash: password_hash(req.body.new_password1)});
      await user.save();
      res.sendStatus(200);
      res.end();
    } else {
      res.sendStatus(500);
      res.end();
    }
  });
}
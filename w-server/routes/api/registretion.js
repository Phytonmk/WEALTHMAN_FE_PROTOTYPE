const crypto = require('crypto')
const fs = require('fs-extra')

const User = require('../../models/User')
const Token = require('../../models/accessToken')
const Investor = require('../../models/Investor')
const Manager = require('../../models/Manager')
const ManagerStatistic = require('../../models/ManagerStatistic')
const Company = require('../../models/Company')
const AnswersForm = require('../../models/AnswersForm')
const KYCAnswersForm = require('../../models/KYCAnswersForm')
const EmailConfirmation = require('../../models/EmailConfirmation')

const mailer = require('../../helpers/mailer')

const currentDomain = 'platform.wealthman.io'
const salt = 'super salt'

const genToken = (user) => {
  const token = 
    crypto.createHash('md5')
    .update(
      salt +
      user._id +
      salt +
      (new Date).getTime() +
      salt +
      user.password_hash +
      salt
    ).digest("hex")
  return token
}


const password_hash = (password) => crypto.createHash('md5').update(salt + password + salt).digest("hex")

module.exports = (app) => {
  app.post('/api/register', async (req, res, next) => {
    if (!req.body.login || !req.body.password) {
      res.sendStatus(500)
      res.end()
      return
    }
    const user = new User({
      login: req.body.login,
      password_hash: password_hash(req.body.password),
    })
    const token = genToken(user)
    const accessToken = new Token({
      user: user._id,
      token
    })

    const confirmToken = crypto.createHash('md5').update(token + salt + token + salt).digest("hex")
    if (/^[^@]+@{1}[^\.]+\.{1}.+$/.test(req.body.login)) {
      const email = {
        Recipients: [{ Email: req.body.login }],
        Subject: 'Confirm your email',
        'Text-part': `To confirm your email follow this link http://${currentDomain}:8080/api/confirm-email/${confirmToken}`,
        'Html-part': `To confirm your email follow <a href="http://${currentDomain}:8080/api/confirm-email/${confirmToken}">this link</a>`,
        FromEmail: `no-reply@${currentDomain}`,
        FromName: 'Wealthman registration'
      } 
      await mailer(email).catch(console.log)
    }

    const emailConfirmation = new EmailConfirmation({
      user: user._id,
      token: confirmToken
    })
    await user.save()
    await accessToken.save()
    await emailConfirmation.save()
    res.send({token, confirmToken}) // remove confirmToken from response
    console.log('reg compelted')
    res.end()
  })
  app.post('/api/register-new-client', async (req, res, next) => {
    const ManagersAccessToken = await Token.findOne({token: req.body.accessToken});
    if (ManagersAccessToken === null) {
      res.status(403);
      res.end('');
      return;
    }
    const manager = await Manager.findOne({user: ManagersAccessToken.user});
    if (manager === null) {
      res.status(403);
      res.end('');
      return;
    }
    if (!req.body.login) {
      res.sendStatus(500)
      res.end()
      return
    }
    const alphabet = '123456789qwertyuiopasdfghjklzxvbnm'
    let password = ''
    while (password.length < 12)
      password += (Math.random() > 0.5 ? alphabet : alphabet.toUpperCase())[Math.floor(Math.random() * alphabet.length)]
    const user = new User({
      login: req.body.login,
      password_hash: password_hash(password),
      invited: manager.user
    })
    const token = genToken(user)
    const accessToken = new Token({
      user: user._id,
      token
    })
    const confirmToken = crypto.createHash('md5').update(token + salt + token + salt).digest("hex")
    if (/^[^@]+@{1}[^\.]+\.{1}.+$/.test(req.body.login)) {
      const email = {
        Recipients: [{ Email: req.body.login }],
        Subject: 'Confirm your email',
        'Text-part': `Manager ${(manager.name || '') + (manager.surname ? ' ' + manager.surname : '')} offer you to become his new client on wealthman.io\n\nTo start investing, conifrm you email via this link http://${currentDomain}:8080/api/confirm-email/${confirmToken}, then use your new login and password on platform.wealthman.io\n\nlogin: ${req.body.login}\npassword: ${password}\n(you can change it any time)\n\nAnd contact this manager http://platform.wealthman.io/manager/${manager._id}`,
        'Html-part': `Manager ${(manager.name || '') + (manager.surname ? ' ' + manager.surname : '')} offer you to become his new client on wealthman.io<br><br>To start investing, conifrm you email via <a href="http://${currentDomain}:8080/api/confirm-email/${confirmToken}">this link</a>, then use your new login and password on <a href="http://platform.wealthman.io">platform.wealthman.io</a><br><br>login: ${req.body.login}<br>password: ${password}<br>(you can change it any time)<br><br>And contact <a href="http://platform.wealthman.io/manager/${manager._id}">this manager</a>`,
        FromEmail: `no-reply@${currentDomain}`,
        FromName: 'Wealthman registration'
      } 
      await mailer(email).catch(console.log)
    }

    const emailConfirmation = new EmailConfirmation({
      user: user._id,
      token: confirmToken
    })
    await user.save()
    await accessToken.save()
    await emailConfirmation.save()
    console.log('reg compelted')
    res.send({token})
    res.end()
  })
  app.get('/api/confirm-email/:token', async (req, res, next) => {
    const emailConfirmation = await EmailConfirmation.findOne({token: req.params.token})
    if (emailConfirmation === null) {
      res.sendStatus(404)
      res.end('')
      return
    }
    const user = await User.findById(emailConfirmation.user)
    if (user === null) {
      res.sendStatus(500)
      res.end('')
      return
    }
    user.set({confirmed: true})
    await user.save()
    await EmailConfirmation.findOneAndRemove({token: req.params.token})
    res.send('Your email has been successfully verified')
    res.end()
  })
  app.post('/api/investor/agree', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken})
    if (token === null) {
      res.sendStatus(403)
      res.end('')
      return
    }
    const user = await User.findById(token.user)
    if (user === null) {
      res.sendStatus(500)
      res.end()
      return
    }
    user.set({agreed: true, type: 0})
    await user.save()
    const investor = new Investor({user: user._id})
    await investor.save()
    res.sendStatus(200)
    res.end()
  })
  app.post('/api/investor/risk', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken})
    if (token === null) {
      res.sendStatus(403)
      res.end('')
      return
    }
    const investor = await Investor.findOne({user: token.user})
    if (investor === null) {
      res.sendStatus(500)
      res.end()
      return
    }

    // HANDLING
    // const riskprofile = Math.ceil(Math.random() * 10)

    // console.log('riskprofile', riskprofile)

    const answersForm = new AnswersForm({
      user: token.user,
      answers: req.body.answers
    })
    await answersForm.save()
    // investor.set({riskprofile})
    // await investor.save()
    // res.send(riskprofile.toString())
    res.status(200)
    res.end()
  })
  app.post('/api/investor/data', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken})
    if (token === null) {
      res.sendStatus(403)
      res.end('')
      return
    }
    const user = await User.findById(token.user)
    if (user === null) {
      res.sendStatus(500)
      res.end()
      return
    }
    user.set({type: 0})
    await user.save()
    let investor = await Investor.findOne({user: token.user})
    if (investor === null)
      investor = new Investor({user: token.user})
    investor.set(req.body)
    await investor.save()
    console.log('--')
    res.sendStatus(200)
    res.end()
  })
  app.post('/api/manager/data', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken})
    if (token === null) {
      res.sendStatus(403)
      res.end('')
      return
    }
    const user = await User.findById(token.user)
    if (user === null) {
      res.sendStatus(500)
      res.end()
      return
    }
    user.set({type: 1})
    await user.save()
    let manager = await Manager.findOne({user: user._id})
    if (manager === null) {
      manager = new Manager(Object.assign(req.body, {user: user._id}))
    } else {
      manager.set(req.body)
    }
    await manager.save()
    const managerStatistic = new ManagerStatistic({
      manager: manager._id,
      last_update: Date.now(),
      dates: [Date.now()],
      aum: [0],
      portfolios: [{
        active: 0,
        archived: 0,
        inProgress: 0
      }]
    })
    await managerStatistic.save()
    res.sendStatus(200)
    res.end()
  })
  app.post('/api/photo/investor', async (req, res, next) => {
    console.log(req.headers)
    const token = await Token.findOne({token: req.headers.accesstoken})
    if (token === null) {
      res.sendStatus(403)
      res.end('')
      return
    }
    const investor = await Investor.findOne({user: token.user})
    if (!req.files)
      return res.sendStatus(400).send('No files were uploaded.')
    const file = req.files.file
    await fs.ensureDir(__dirname+ '/../../img/investors/')
    req.files.file.mv(__dirname+ '/../../img/investors/' + investor._id + '.png', async (err) => {
      if (err)
        return res.sendStatus(500).send(err)
      investor.set({img: 'investors/' + investor._id + '.png'})
      await investor.save()
      res.send('investors/' + investor._id + '.png')
      res.end()
    })
  })
  app.post('/api/photo/manager', async (req, res, next) => {
    console.log(req.headers)
    const token = await Token.findOne({token: req.headers.accesstoken})
    if (token === null) {
      res.sendStatus(403)
      res.end('')
      return
    }
    let manager = await Manager.findOne({user: token.user})
    if (manager === null) {
      manager = new Manager(Object.assign(req.body, {user: token.user}))
    }
    if (!req.files) {
      res.sendStatus(400).send('No files were uploaded.')
      return
    }
    const file = req.files.file
    await fs.ensureDir(__dirname+ '/../../img/managers/')
    req.files.file.mv(__dirname+ '/../../img/managers/' + manager._id + '.png', async (err) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
        return
      }
      manager.set({img: 'managers/' + manager._id + '.png'})
      await manager.save()
      res.send('managers/' + manager._id + '.png')
      res.end()
    })
  })
  app.post('/api/photo/company', async (req, res, next) => {
    console.log(req.headers)
    const token = await Token.findOne({token: req.headers.accesstoken})
    if (token === null) {
      res.sendStatus(403)
      res.end('')
      return
    }
    let company = await Company.findOne({user: token.user})
    if (company === null) {
      company = new Company(Object.assign(req.body, {user: token.user}))
    }
    if (!req.files)
      return res.sendStatus(400).send('No files were uploaded.')
    const file = req.files.file
    await fs.ensureDir(__dirname+ '/../../img/companies/')
    req.files.file.mv(__dirname+ '/../../img/companies/' + company._id + '.png', async (err) => {
      if (err)
        return res.sendStatus(500).send(err)
      company.set({img: 'companies/' + company._id + '.png'})
      await company.save()
      res.send('companies/' + company._id + '.png')
      res.end()
    })
  })
  app.post('/api/company/data', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken})
    if (token === null) {
      res.sendStatus(403)
      res.end('')
      return
    }
    const user = await User.findById(token.user)
    if (user === null) {
      res.sendStatus(500)
      res.end()
      return
    }
    user.set({type: 3})
    await user.save()
    const foundCompany = await Company.findOne({user: user._id})
    if (foundCompany === null) {
      const company = new Company(Object.assign(req.body, {user: user._id}))
      await company.save()
    } else {
      await Company.findOneAndUpdate({user: user._id}, req.body)
    }
    res.sendStatus(200)
    res.end()
  })
  app.post('/api/login', async (req, res, next) => {
    const user = await User.findOne({
      login: req.body.login,
      password_hash: password_hash(req.body.password)
    })
    if (user === null) {
      res.sendStatus(403)
      console.log(`Wrong login or password:\n${req.body.login}\n${req.body.password}\n${password_hash(req.body.password)}`)
      res.end()
      return
    }
    const token = genToken(user)
    const accessToken = new Token({
      user: user._id,
      token
    })
    await accessToken.save()
    res.send({accessToken: accessToken.token, usertype: user.type})
    res.end()
  })
  app.post('/api/logout', async (req, res, next) => {
    await Token.findOneAndRemove({token: req.body.accessToken})
    res.sendStatus(200)
    res.end()
  })
  app.post('/api/getme', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken})
    if (token === null) {
      res.sendStatus(403)
      res.end('')
      return
    }
    const user = await User.findById(token.user)
    if (user === null) {
      res.sendStatus(500)
      res.end()
      return
    }
    if (!user.confirmed) {
      res.send(401)
      res.end()
    }
    let userData = {}
    switch (user.type) {
      case 0:
        userData = await Investor.findOne({user: user._id})
        break
      case 1:
        userData = await Manager.findOne({user: user._id})
        break
      case 3:
        userData = await Company.findOne({user: user._id})
        break
    }
    user.set({last_request: Date.now()})
    await user.save()
    res.send({usertype: user.type, userData})
    res.end()
  })
  app.post('/api/changepassword', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken})
    if (token === null) {
      res.sendStatus(403)
      res.end('')
      return
    }
    const user = await User.findById(token.user).where({password_hash: password_hash(req.body.old_password)})
    if (user === null) {
      res.sendStatus(403)
      res.end()
      return
    }
    if (req.body.new_password1 === req.body.new_password2) {
      user.set({password_hash: password_hash(req.body.new_password1)})
      await user.save()
      res.sendStatus(200)
      res.end()
    } else {
      res.sendStatus(500)
      res.end()
    }
  })
}
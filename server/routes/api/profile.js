const fs = require('fs-extra')
const axios = require('axios')

const configs = require('../../configs')

const tokensAndPasswords = require('../../helpers/tokens-and-passwords')

const OAuthModel = require('../../models/OAuth')
const User = require('../../models/User')
const AccessToken = require('../../models/accessToken')
const Investor = require('../../models/Investor')
const InvestorStatistic = require('../../models/InvestorStatistic')
const Manager = require('../../models/Manager')
const ManagerStatistic = require('../../models/ManagerStatistic')
const Company = require('../../models/Company')
const AnswersForm = require('../../models/AnswersForm')
const KYCAnswersForm = require('../../models/KYCAnswersForm')
const EmailConfirmation = require('../../models/EmailConfirmation')
const EmailChanging = require('../../models/emailChanging')
const PasswordReset = require('../../models/PasswordReset')
const KYCBlank = require('../../models/KYCBlank')

const mailer = require('../../helpers/mailer')

module.exports = (app) => {
  // Регистрирует пользователя и отправляет сообщение на почту, взятую из логина
  app.post('/api/register', async (req, res, next) => {
    if (!req.body.login) {
      res.status(400)
      res.end()
      return
    }
    let generatedPassword = false
    if (!req.body.password || req.body.password == '') {
      generatedPassword = true
      req.body.password = tokensAndPasswords.newPassword()
    }
    const accountWithThisLogin = await User.findOne({login: req.body.login})
    if (accountWithThisLogin !== null) {
      res.status(403)
      res.end()
      return
    }
    const user = new User({
      login: req.body.login,
      password_hash: tokensAndPasswords.passwordHash(req.body.password),
    })
    const token = tokensAndPasswords.genAccessToken(user)
    const accessToken = new AccessToken({
      user: user._id,
      token
    })

    const confirmToken = tokensAndPasswords.genConfirmToken(token)
    let emailText = `To confirm your email follow <a href="http://${configs.host}:8080/api/confirm-email/${confirmToken}">this link</a>`
    if (generatedPassword) {
      emailText += '<br><br>'
      emailText += `Your login: ${req.body.login}<br>`
      emailText += `Your password: ${req.body.password}<br>`
    }
    if (/^[^@]+@{1}[^\.]+\.{1}.+$/.test(req.body.login)) {
      const email = {
        Recipients: [{ Email: req.body.login }],
        Subject: 'Confirm your email',
        //'Text-part': `To confirm your email follow this link http://${configs.host}:8080/api/confirm-email/${confirmToken}`,
        'Html-part': emailText,
        FromEmail: `no-reply@${configs.host}`,
        FromName: 'Wealthman registration'
      }
      await mailer(email).catch(console.log)
    }

    const emailConfirmation = new EmailConfirmation({
      user: user._id,
      token: confirmToken
    })
    if (req.body.register === 'investor') {
      user.set({type: 0})
      const investor = new Investor({user: user.id, name: 'Anonymous investor', surname: ''})
      await createInvestorStatistics(investor.id)
      await investor.save()
    }
    await user.save()
    await accessToken.save()
    await emailConfirmation.save()
    res.send({token, dataFilled: req.body.register === 'investor', confirmToken}) // remove confirmToken from response
    res.end()
  })
  // Авторизирует или регстрирует пользователя через внешние сервисы
  // Возможные значения service: google, facebook
  app.post('/api/oauth/:service', async (req, res, next) => {
    if (!['google', 'facebook'].includes(req.params.service)) {
      res.status(400)
      res.end()
      return
    }
    const token = req.body.token
    let url = ''
    if (req.params.service === 'facebook')
      url = `https://graph.facebook.com/me?access_token=${token}&fields=email`
    if (req.params.service === 'google')
      url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`
    const request = await axios.get(url)
      .catch((e) => {
        console.log(e)
        res.status(403)
        res.end()
      })
    const userData = request.data
    if (userData && userData.email) {
      userData.email = userData.email.replace('\\u0040', '@')
      let oauthModel = await OAuthModel.findOne({
        service: req.params.service,
        in_service_id: userData.id
      })
      if (oauthModel === null) {
        const user = new User({
          login: userData.email,
          confirmed: true,
        })
        const accessTokenString = tokensAndPasswords.genAccessToken(user)
        const accessToken = new AccessToken({
          user: user.id,
          token: accessTokenString
        })
        oauthModel = new OAuthModel({
          user: user.id,
          service: req.params.service,
          in_service_id: userData.id,
          token
        })
        const username = {first: '', last: ''}
        if (!userData.name.includes(' ')) {
          username.first = userData.name
        } else {
          username.first = userData.name.split(' ')[0]
          username.last = userData.name.split(' ')[1]
        }
        switch (req.body.register) {
          case 'investor':
            user.set({type: 0})
            const investor = new Investor({user: user.id, name: username.first, surname: username.last})
            await createInvestorStatistics(investor.id)
            await investor.save()
            break
          case 'manager':
            user.set({type: 1})
            const manager = new Manager({user: user.id, name: username.first, surname: username.last})
            await createManagersStatistics(manager.id)
            await manager.save()
            break
          case 'compnay':
            user.set({type: 3})
            const compnay = new Company({user: user.id, name: username.first, surname: username.last})
            await compnay.save()
            break
        }
        await user.save()
        await accessToken.save()
        await oauthModel.save()
        res.send({token: accessTokenString, dataFilled: ['investor', 'manager', 'company'].includes(req.body.register)})
        res.end()
      } else {
        oauthModel.set({token})
        const user = await User.findById(oauthModel.user)
        if (user === null) {
          res.status(500)
          res.end()
          return
        }
        const accessTokenString = tokensAndPasswords.genAccessToken(user)
        const accessToken = new AccessToken({
          user: user._id,
          token: accessTokenString
        })
        await oauthModel.save()
        await accessToken.save()
        res.send({token: accessTokenString, dataFilled: user.type !== undefined, usertype: user.type})
        res.end()
      }
    } else {
      res.status(500)
      res.end()
    }
  })
  // Регистрирует нового пользователя с аккаунта менеджера
  app.post('/api/register-new-client', async (req, res, next) => {
    const ManagersAccessToken = await AccessToken.findOne({token: req.body.accessToken});
    if (ManagersAccessToken === null) {
      res.status(403);
      res.end();
      return;
    }
    const manager = await Manager.findOne({user: ManagersAccessToken.user});
    if (manager === null) {
      res.status(403);
      res.end();
      return;
    }
    if (!req.body.login) {
      res.status(500)
      res.end()
      return
    }
    const alphabet = '123456789qwertyuiopasdfghjklzxvbnm'
    let password = ''
    while (password.length < 12)
      password += (Math.random() > 0.5 ? alphabet : alphabet.toUpperCase())[Math.floor(Math.random() * alphabet.length)]
    const user = new User({
      login: req.body.login,
      password_hash: tokensAndPasswords.passwordHash(password),
      invited: manager.user
    })
    const token = tokensAndPasswords.genAccessToken(user)
    const accessToken = new AccessToken({
      user: user._id,
      token
    })
    const investor = new Investor({
      user: user.id,
      name: '',
      source: 'Added client'
    })
    const confirmToken = tokensAndPasswords.genConfirmToken(token)
    if (/^[^@]+@{1}[^\.]+\.{1}.+$/.test(req.body.login)) {
      const email = {
        Recipients: [{ Email: req.body.login }],
        Subject: 'Confirm your email',
        'Html-part': `Manager ${(manager.name || '') + (manager.surname ? ' ' + manager.surname : '')} offer you to become his new client on wealthman.io<br><br>To start investing, conifrm you email via <a href="http://${configs.host}:8080/api/confirm-email/${confirmToken}">this link</a>, then use your new login and password on <a href="http://platform.wealthman.io">platform.wealthman.io</a><br><br>login: ${req.body.login}<br>password: ${password}<br>(you can change it any time)<br><br>And contact <a href="http://platform.wealthman.io/manager/${manager._id}">this manager</a>`,
        FromEmail: `no-reply@${configs.host}`,
        FromName: 'Wealthman registration'
      } 
      await mailer(email).catch(console.log)
    }

    const emailConfirmation = new EmailConfirmation({
      user: user.id,
      token: confirmToken
    })
    await user.save()
    await createInvestorStatistics(investor.id)
    await investor.save()
    await accessToken.save()
    await emailConfirmation.save()
    res.send({token})
    res.end()
  })
  // Подтверждение почты
  app.get('/api/confirm-email/:token', async (req, res, next) => {
    const emailConfirmation = await EmailConfirmation.findOne({token: req.params.token})
    if (emailConfirmation === null) {
      res.status(404)
      res.end()
      return
    }
    const user = await User.findById(emailConfirmation.user)
    if (user === null) {
      res.status(500)
      res.end()
      return
    }
    user.set({confirmed: true})
    await user.save()
    await EmailConfirmation.findOneAndRemove({token: req.params.token})
    res.send('Your email has been successfully verified')
    res.end()
  })
  // Запрос на восстановление пароля
  app.post('/api/forgot-password', async (req, res, next) => {
    const user = await User.findOne({login: req.body.email})
    if (user === null) {
      res.status(404)
      res.end()
      return
    }
    const code = tokensAndPasswords.passwordResetToken()
    const passwordReset = new PasswordReset({
      user: user._id,
      email: req.body.email,
      code
    })
    await passwordReset.save()
    const email = {
      Recipients: [{ Email: user.login }],
      Subject: 'Password reset',
      'Html-part': `To reset your password go to <a href="http://${configs.host}/#/password-reset?email=${req.body.email}&code=${code}">this link</a>`,
      FromEmail: `no-reply@${configs.host}`,
      FromName: 'Wealthman platform'
    } 
    await mailer(email).catch(console.log)
    res.status(200)
    res.end()
  })
  // Смена пароля по коду восстановления
  app.post('/api/password-reset', async (req, res, next) => {
    const passwordReset = await PasswordReset.findOne({
      email: req.body.email,
      code: req.body.code,
      used: false
    })
    if (passwordReset === null) {
      res.status(404)
      res.end()
      return
    }
    if (Date.now() - passwordReset.date.getTime() > 1000 * 60 * 60 * 24 * 2) {
      res.status(408)
      res.end()
      return
    }
    const user = await User.findById(passwordReset.user)
    user.set({password_hash: tokensAndPasswords.passwordHash(req.body.password)})
    await user.save()
    passwordReset.set({used: true})
    await passwordReset.save()
    const token = tokensAndPasswords.genAccessToken(user)
    const accessToken = new AccessToken({
      user: user._id,
      token
    })
    await accessToken.save()
    res.send({accessToken: accessToken.token, usertype: user.type})
    res.status(200)
    res.end()
  })
  // [not used] Подтверждение согласия инвестора с правилами платформы 
  app.post('/api/investor/agree', async (req, res, next) => {
    const token = await AccessToken.findOne({token: req.body.accessToken})
    if (token === null) {
      res.status(403)
      res.end()
      return
    }
    const user = await User.findById(token.user)
    if (user === null) {
      res.status(500)
      res.end()
      return
    }
    user.set({agreed: true, type: 0})
    await user.save()
    const investor = new Investor({user: user._id})
    await createInvestorStatistics(investor.id)
    await investor.save()
    res.status(200)
    res.end()
  })
  // Сохранение формы "после регистрации" и генерация уровня риска инвестора
  app.post('/api/investor/risk', async (req, res, next) => {
    const token = await AccessToken.findOne({token: req.body.accessToken})
    if (token === null) {
      res.status(403)
      res.end()
      return
    }
    const investor = await Investor.findOne({user: token.user})
    if (investor === null) {
      res.status(500)
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
  // Обновление аккаунта инвестора или его создание из только что зарегестрированного аккаунта пользователя
  app.post('/api/investor/data', async (req, res, next) => {
    const token = await AccessToken.findOne({token: req.body.accessToken})
    if (token === null) {
      res.status(403)
      res.end()
      return
    }
    const user = await User.findById(token.user)
    if (user === null) {
      res.status(500)
      res.end()
      return
    }
    if (user.type !== undefined && user.type !== 0) {
      res.status(403)
      res.end()
      return
    }
    user.set({type: 0})
    await user.save()
    let investor = await Investor.findOne({user: token.user})
    if (investor === null) {
      investor = new Investor({user: token.user})
      await createInvestorStatistics(investor.id)
    }
    investor.set(req.body)
    await investor.save()
    console.log('--')
    res.status(200)
    res.end()
  })
  // Обновление аккаунта менеджера или его создание из только что зарегестрированного аккаунта пользователя
  app.post('/api/manager/data', async (req, res, next) => {
    const token = await AccessToken.findOne({token: req.body.accessToken})
    if (token === null) {
      res.status(403)
      res.end()
      return
    }
    const user = await User.findById(token.user)
    if (user === null) {
      res.status(500)
      res.end()
      return
    }
    if (user.type !== undefined && user.type !== 1) {
      res.status(403)
      res.end()
      return
    }
    user.set({type: 1})
    await user.save()
    let manager = await Manager.findOne({user: user._id})
    if (manager === null) {
      manager = new Manager(Object.assign(req.body, {user: user._id}))
      await createManagersStatistics(manager.id)
    } else {
      manager.set(req.body)
    }
    await manager.save()
    res.status(200)
    res.end()
  })
  // Загрузка фото для инвестора
  app.post('/api/photo/investor', async (req, res, next) => {
    console.log(req.headers)
    const token = await AccessToken.findOne({token: req.headers.accesstoken})
    if (token === null) {
      res.status(403)
      res.end()
      return
    }
    const investor = await Investor.findOne({user: token.user})
    if (!req.files)
      return res.status(400).send('No files were uploaded.')
    const file = req.files.file
    await fs.ensureDir(__dirname+ '/../../img/investors/')
    req.files.file.mv(__dirname+ '/../../img/investors/' + investor._id + '.png', async (err) => {
      if (err)
        return res.status(500).send(err)
      investor.set({img: 'investors/' + investor._id + '.png'})
      await investor.save()
      res.send('investors/' + investor._id + '.png')
      res.end()
    })
  })
  // Загрузка фото для менеджера
  app.post('/api/photo/manager', async (req, res, next) => {
    console.log(req.headers)
    const token = await AccessToken.findOne({token: req.headers.accesstoken})
    if (token === null) {
      res.status(403)
      res.end()
      return
    }
    let manager = await Manager.findOne({user: token.user})
    if (manager === null) {
      manager = new Manager(Object.assign(req.body, {user: token.user}))
      await createManagersStatistics(manager.id)
    }
    if (!req.files) {
      res.status(400).send('No files were uploaded.')
      return
    }
    const file = req.files.file
    await fs.ensureDir(__dirname+ '/../../img/managers/')
    req.files.file.mv(__dirname+ '/../../img/managers/' + manager._id + '.png', async (err) => {
      if (err) {
        console.log(err)
        res.status(500)
        return
      }
      manager.set({img: 'managers/' + manager._id + '.png'})
      await manager.save()
      res.send('managers/' + manager._id + '.png')
      res.end()
    })
  })
  // Загрузка фото для компании
  app.post('/api/photo/company', async (req, res, next) => {
    console.log(req.headers)
    const token = await AccessToken.findOne({token: req.headers.accesstoken})
    if (token === null) {
      res.status(403)
      res.end()
      return
    }
    let company = await Company.findOne({user: token.user})
    if (company === null) {
      company = new Company(Object.assign(req.body, {user: token.user}))
    }
    if (!req.files)
      return res.status(400).send('No files were uploaded.')
    const file = req.files.file
    await fs.ensureDir(__dirname+ '/../../img/companies/')
    req.files.file.mv(__dirname+ '/../../img/companies/' + company._id + '.png', async (err) => {
      if (err)
        return res.status(500).send(err)
      company.set({img: 'companies/' + company._id + '.png'})
      await company.save()
      res.send('companies/' + company._id + '.png')
      res.end()
    })
  })
  // Обновление аккаунта компании или его создание из только что зарегестрированного аккаунта пользователя
  app.post('/api/company/data', async (req, res, next) => {
    const token = await AccessToken.findOne({token: req.body.accessToken})
    if (token === null) {
      res.status(403)
      res.end()
      return
    }
    const user = await User.findById(token.user)
    if (user === null) {
      res.status(500)
      res.end()
      return
    }
    if (user.type !== undefined && user.type !== 3) {
      res.status(403)
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
    res.status(200)
    res.end()
  })
  // Авторизация
  app.post('/api/login', async (req, res, next) => {
    const user = await User.findOne({
      login: req.body.login,
      password_hash: tokensAndPasswords.passwordHash(req.body.password)
    })
    if (user === null) {
      res.status(403)
      // console.log(`Wrong login or password:\n${req.body.login}\n${req.body.password}\n${tokensAndPasswords.passwordHash(req.body.password)}`)
      res.end()
      return
    }
    const token = tokensAndPasswords.genAccessToken(user)
    const accessToken = new AccessToken({
      user: user._id,
      token
    })
    await accessToken.save()
    res.send({accessToken: accessToken.token, usertype: user.type})
    res.end()
  })
  // Удаление текущего токена доступа
  app.post('/api/logout', async (req, res, next) => {
    await AccessToken.findOneAndRemove({token: req.body.accessToken})
    res.status(200)
    res.end()
  })
  // Получение информации о текущем аккаунте через токен доступа
  app.post('/api/getme', async (req, res, next) => {
    const token = await AccessToken.findOne({token: req.body.accessToken})
    if (token === null) {
      res.status(403)
      res.end()
      return
    }
    const user = await User.findById(token.user)
    if (user === null) {
      res.status(500)
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
    res.send({usertype: user.type, userData, testNetwork: !configs.productionMode})
    res.end()
  })
  // Смена пароля
  app.post('/api/changepassword', async (req, res, next) => {
    const token = await AccessToken.findOne({token: req.body.accessToken})
    if (token === null) {
      res.status(403)
      res.end()
      return
    }
    const user = await User.findById(token.user).where({password_hash: tokensAndPasswords.passwordHash(req.body.old_password)})
    if (user === null) {
      res.status(403)
      res.end()
      return
    }
    if (req.body.new_password1 === req.body.new_password2) {
      user.set({password_hash: tokensAndPasswords.passwordHash(req.body.new_password1)})
      await user.save()
      res.status(200)
      res.end()
    } else {
      res.status(500)
      res.end()
    }
  })
  // Проверка на доступность логина для регистрации
  app.post('/api/check-login', async (req, res, next) => {
    if (!req.body.login || req.body.login === '') {
      res.status(403)
      res.end()
      return
    }
    const accountWithThisLogin = await User.findOne({login: req.body.login})
    if (accountWithThisLogin !== null) {
      res.status(403)
      res.end()
      return
    }
    res.status(200)
    res.end()
  })
  // [deprecated] Получить текущий email аккаунта вида us***@example.com
  app.get('/api/my-email', async (req, res, next) => {
    const token = await AccessToken.findOne({token: req.headers.accesstoken})
    if (token === null) {
      res.status(403)
      res.end()
      return
    }
    const user = await User.findById(token.user)
    if (user === null) {
      res.status(403)
      res.end()
      return
    }
    if (!user.login) {
      res.status(500)
      res.end()
      return
    }
    let userLogin = user.login
    if (userLogin.includes('@')) {
      if (userLogin.indexOf('@') < 3)
        userLogin = '***' + userLogin.substr(userLogin.indexOf('@'))
      else
        userLogin = userLogin.substr(0, 2) + '***' + userLogin.substr(userLogin.indexOf('@'))
    }
    res.send(userLogin)
    res.status(200)
    res.end()
  })
  // Запросить смену логина
  app.post('/api/change-email', async (req, res, next) => {
    const token = await AccessToken.findOne({token: req.body.accessToken})
    if (token === null) {
      res.status(403)
      res.end()
      return
    }
    const user = await User.findById(token.user)
    if (user === null) {
      res.status(403)
      res.end()
      return
    }
    const userWithThisEmail = await User.findOne({login: req.body.email})
    if (userWithThisEmail !== null) {
      res.status(403)
      res.end()
      return
    }
    if (!/^[^@]+@{1}[^\.]+\.{1}.+$/.test(req.body.email)) {
      res.status(400)
      res.end()
      return
    }
    const emailChanging = new EmailChanging({
      user: user._id,
      oldEmailConfirmationToken: tokensAndPasswords.genConfirmToken(token),
      newEmailConfirmationToken: tokensAndPasswords.genConfirmToken(token),
      oldEmail: user.login,
      newEmail: req.body.email,
      oldEmailConfirmed: false,
      newEmailConfirmed: false,
    })
    await emailChanging.save()
    const email = {
      Recipients: [{ Email: user.login }],
      Subject: 'Confirm email change',
      'Html-part': `To change you email address click <a href="http://${configs.host}:8080/api/confirm-email-change/old/${emailChanging.oldEmailConfirmationToken}">this link</a>`,
      FromEmail: `no-reply@${configs.host}`,
      FromName: 'Wealthman platform'
    } 
    await mailer(email).catch(console.log)
    res.status(200)
    res.end()
  })
  // Подтверждение смены логина
  app.get('/api/confirm-email-change/:email/:token', async (req, res, next) => {
    let emailChanging;
    if (req.params.email === 'old')
      emailChanging = await EmailChanging.findOne({oldEmailConfirmationToken: req.params.token, oldEmailConfirmed: false, newEmailConfirmed: false})
    else
      emailChanging = await EmailChanging.findOne({newEmailConfirmationToken: req.params.token, oldEmailConfirmed: true, newEmailConfirmed: false})
    if (emailChanging === null) {
      res.status(404)
      res.end()
      return
    }
    const user = await User.findById(emailChanging.user).where({login: emailChanging.oldEmail})
    if (user === null) {
      res.status(500)
      res.end()
      return
    }
    if (req.params.email === 'old') {
      emailChanging.set({oldEmailConfirmed: true})
      const email = {
        Recipients: [{ Email: emailChanging.newEmail }],
        Subject: 'Confirm email change',
        'Html-part': `To change you email address click <a href="http://${configs.host}:8080/api/confirm-email-change/new/${emailChanging.newEmailConfirmationToken}">this link</a>`,
        FromEmail: `no-reply@${configs.host}`,
        FromName: 'Wealthman platform'
      } 
      await emailChanging.save()
      await mailer(email).catch(console.log)
      res.send('Confirmation link was sent to new email ' + emailChanging.newEmail)
      res.end()
    } else {
      emailChanging.set({newEmailConfirmed: true})
      user.set({login: emailChanging.newEmail})
      await user.save()
      await emailChanging.save()
      res.send('Greate! You email was changed')
      res.end()
    }
  })
  // Загрузка на сервер документов пользователя: id или selfy
  app.post('/api/photo/doc/:fileType', async (req, res, next) => {
    if (!['id', 'selfy'].includes(req.params.fileType)) {
      res.status(400)
      res.end()
      return
    }
    const token = await AccessToken.findOne({token: req.headers.accesstoken})
    if (token === null) {
      res.status(403)
      res.end()
      return
    }
    let manager = await Manager.findOne({user: token.user}), investor = null, user = null
    if (manager === null) {
      investor = await Investor.findOne({user: token.user})
      if (investor === null) {
        res.status(403)
        res.end()
        return
      } else {
        user = investor.user
      }
    } else {
      user = manager.user
    }
    if (!req.files) {
      res.status(400)
      res.end()
      return
    }
    const file = req.files.file
    const extenstion = file.name.split('.')[file.name.split('.').length - 1]
    if (!['pdf', 'doc', 'docx', 'jpg', 'png'].includes(extenstion.toLowerCase())) {
      console.log(`Wrong file extenstion for file ${file.name} "${extenstion}"\npdf, doc, docx, jpg, png only allowed`)
      res.status(400)
      res.end()
      return
    }
    await fs.ensureDir(`${__dirname}/../../img/kyc-blanks/${user}/${req.params.fileType}`)
    file.mv(`${__dirname}/../../img/kyc-blanks/${user}/${req.params.fileType}/${file.name}`, async (err) => {
      if (err) {
        console.log(err)
        res.status(500)
        return
      }
      let blank = await KYCBlank.findOne({user: token.user})
      if (blank === null) {
        blank = new KYCBlank({user: token.user, [req.params.fileType]: `kyc-blanks/${user}/${req.params.fileType}/${file.name}`})
      } else {
        blank.set({[req.params.fileType]: `kyc-blanks/${user}/${req.params.fileType}/${file.name}`})
      }
      await blank.save()
      res.send(`kyc-blanks/${user}/${req.params.fileType}/${file.name}`)
      res.end()
    })
  })
  // Отправка персональной информации о пользователе
  app.post('/api/kyc-blank', async (req, res, next) => {
    const token = await AccessToken.findOne({token: req.body.accessToken})
    if (token === null) {
      res.status(403)
      res.end()
      return
    }
    let blank = await KYCBlank.findOne({user: token.user})
    const data = Object.assign({}, req.body)
    data.accessToken = undefined
    if (blank === null) {
      blank = new KYCBlank({user: token.user, data})
    } else {
      blank.set({data})
    }
    await blank.save()
    res.status(200)
    res.end()
  })
  // Скачивание персональной информации о пользователе
  app.get('/api/kyc-blank', async (req, res, next) => {
    const token = await AccessToken.findOne({token: req.headers.accesstoken})
    if (token === null) {
      res.status(403)
      res.end()
      return
    }
    const blank = await KYCBlank.findOne({user: token.user})
    res.send(blank !== null ? blank : {})
    res.end()
  })
}

const createManagersStatistics = (managerId) => new Promise(async (resolve, reject) => {
  const managerStatistic = new ManagerStatistic({
    manager: managerId,
    last_update: Date.now(),
    dates: [Date.now()],
    aum: [0],
    portfolios: [{
      active: 0,
      archived: 0,
      inProgress: 0
    }],
    commisions: [{
      accrued: 0,
      paid: 0
    }]
  })
  await managerStatistic.save()
  resolve()
})
const createInvestorStatistics = (investorId) => new Promise(async (resolve, reject) => {
  const investorStatistic = new InvestorStatistic({
    investor: investorId,
    last_update: Date.now(),
    dates: [Date.now()],
    aum: [0],
    portfolios: [{
      active: 0,
      archived: 0,
      inProgress: 0
    }]
  })
  await investorStatistic.save()
  resolve()
})
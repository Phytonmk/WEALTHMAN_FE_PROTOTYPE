const Token = require('../../models/accessToken')
const Investor = require('../../models/Investor')

module.exports = (app) => {
  // Подтверждение нахождения аккаунта инвестора в сети
  app.post('/api/online', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken})
    if (token === null) {
      res.status(403)
      res.end('')
      return
    }
    const investor = await Investor.findOne({user: token.user})
    if (investor === null) {
      res.status(403)
      res.end('')
      return
    }
    investor.set({online: true, last_active: new Date()})
    await investor.save()
    res.status(200)
    res.end()
  })
}
const Token = require('../../models/accessToken')
const User = require('../../models/User')
const PersonalData = require('../../models/PersonalData')

module.exports = (app) => {
  app.post('/api/personal-data/save', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken})
    if (token === null) {
      res.status(403)
      res.end('')
      return
    }
    const user = await User.findById(token.user)
    if (user === null) {
      res.status(403)
      res.end('')
      return
    }
    let personalData = await PersonalData.findOne({user: user._id})
    if (personalData === null)
      personalData = new PersonalData(Object.assign(req.body, {user: user._id}))
    else
      personalData.set(req.body)
    await personalData.save()
    res.status(200)
    res.end()
  })
  app.post('/api/personal-data/load', async (req, res, next) => {
    const token = await Token.findOne({token: req.body.accessToken})
    if (token === null) {
      res.status(403)
      res.end('')
      return
    }
    const user = await User.findById(token.user)
    if (user === null) {
      res.status(403)
      res.end('')
      return
    }
    const personalData = await PersonalData.findOne({user: user._id})
    if (personalData === null)
      res.send({exists: false})
    else
      res.send({exists: true, personalData})
    res.end()
  })
}
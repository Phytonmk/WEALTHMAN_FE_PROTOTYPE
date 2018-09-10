const Token = require('../../models/accessToken')
const Manager = require('../../models/Manager')
const ManagerStatistic = require('../../models/ManagerStatistic')
const Investor = require('../../models/Investor')
const InvestorStatistic = require('../../models/InvestorStatistic')
const Request = require('../../models/Request')
const Company = require('../../models/Company')

module.exports = (app) => {
  app.get('/api/my-dashboard', async (req, res, next) => {
    const token = await Token.findOne({token: req.headers.accesstoken})
    if (token === null) {
      res.status(403)
      res.end('')
      return
    }
    let user = null, manager, company
    const investor = await Investor.findOne({user: token.user})
    if (investor === null) {
      manager = await Manager.findOne({user: token.user})
      if (manager === null) {
        company = await Company.findOne({user: token.user})
        if (company === null) {
          reject(403)
          return
        } else {
          user = 'company'
          userID = company.id
        }
      } else {
        user = 'manager'
        userID = manager.id
      }
    } else {
      user = 'investor'
      userID = investor.id
    }
    switch(user) {
      case 'manager':
        {
          const statistic = await ManagerStatistic.findOne({manager: userID})
          const clients = manager.clients
          const clientsApplications = await Request.aggregate([  
            {
              $match: {
                type: 'portfolio',
                status: 'pending',
                manager: userID
              }
            },
            {
              $group : {
                _id : "$investor",
                count: { $sum: 1 }
              }
            }
          ])
          let change = 0, earning = 0, changeDaysCount = 365
          if (statistic.aum.length > 365 * 2) {
            change = Math.round(manager.aum / statistic.aum[statistic.aum.length - 365] * 100) / 100
            earning = manager.aum - statistic.aum[statistic.aum.length - 365]
          } else {
            change = Math.round(manager.aum / statistic.aum[Math.round(statistic.aum.length / 2)] * 100) / 100
            earning = manager.aum - statistic.aum[Math.round(statistic.aum.length / 2)]
            changeDaysCount = Math.round(statistic.aum.length / 2)
          }
          if (change === null || change === Infinity)
            change = 100
          const aum = {
            value: manager.aum,
            earning,
            change,
            changePeriod: new Date(Date.now() - 1000 * 60 * 60 * 24 * changeDaysCount),
            grpahic: statistic.aum
          }
          const portfolios = statistic.portfolios
          const dates = statistic.dates
          res.send({
            clients,
            clientsApplications: clientsApplications.length,
            profileViews: '?',
            aum,
            portfolios,
            dates,
            commisions: statistic.commisions
          })
          res.end()
        }
      break
      case 'investor':
        {
          const statistic = await InvestorStatistic.findOne({investor: userID})
          let change = 0, earning = 0, changeDaysCount = 365
          if (statistic.aum.length > 365 * 2) {
            change = Math.round(investor.aum / statistic.aum[statistic.aum.length - 365] * 100) / 100
            earning = investor.aum - statistic.aum[statistic.aum.length - 365]
          } else {
            change = Math.round(investor.aum / statistic.aum[Math.round(statistic.aum.length / 2)] * 100) / 100
            earning = investor.aum - statistic.aum[Math.round(statistic.aum.length / 2)]
            changeDaysCount = Math.round(statistic.aum.length / 2)
          }
          if (change === null || change === Infinity)
            change = 100
          const aum = {
            value: investor.aum,
            earning,
            change,
            changePeriod: new Date(Date.now() - 1000 * 60 * 60 * 24 * changeDaysCount),
            grpahic: statistic.aum
          }
          const portfolios = statistic.portfolios
          const dates = statistic.dates
          const eventsAndRequests = await Request.countDocuments({investor: userID})
          res.send({
            aum,
            portfolios,
            portfoliosAmount: investor.portfolios,
            dates,
            reviewed: '?',
            eventsAndRequests
          })
          res.end()
        }
      break
      default:
        res.status(500)
        res.end()
    }
  })
}

genGraphData = () =>{
  const data = []
  const points = 10 + Math.round(Math.random() * 40)
  const range = 20 + Math.round(Math.random() * 60)
  for (let i = 0; i < points; i++)
    data.push({
      x: i,
      y: 10 + i + Math.round(Math.random() * (range / 2)  - range)
    })
  return data
}
genRandom = (min=20, max=80) =>{
  return Math.round(min + Math.random() * (max - min))
}
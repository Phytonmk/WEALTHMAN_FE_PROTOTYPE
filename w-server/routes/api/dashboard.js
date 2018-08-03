const Token = require('../../models/accessToken')
const Manager = require('../../models/Manager')
const ManagerStatistic = require('../../models/ManagerStatistic')
const Investor = require('../../models/Investor')
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
    let user, manager, company
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
        const statistic = await ManagerStatistic.find({manager: userID})
        const clients = await Request.aggregate([  
          {
            $match: {
              type: 'portfolio',
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
        const aum = {
          value: genRandom(5, 15) ** genRandom(5, 15),
          earning: genRandom(5, 15) * (10 ** genRandom(5, 15)),
          change: genRandom(-30, 30),
          grpahic: ManagerStatistic.aum
        }
        const portfolios = ManagerStatistic.portfolios
        res.send({
          clients: clients.length,
          clientsApplications: clientsApplications.length,
          profileViews: '?',
          aum,
          portfolios,
        })
        res.end()
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
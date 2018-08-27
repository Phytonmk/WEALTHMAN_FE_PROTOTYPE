const Request = require('../../models/Request')
const Investor = require('../../models/Investor')
const Manager = require('../../models/Manager')
const ManagerStatistic = require('../../models/ManagerStatistic')

module.exports = () => new Promise(async (resolve, reject) => {
  const date = new Date()
  const endOfPreviusDay = new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate()))
  const statistics = await ManagerStatistic.find(/*{ last_update: { $lt: endOfPreviusDay } }*/)
  for (let statistic of statistics) {
    const statisticObj = statistic.toObject()
    const thisManager = await Manager.findById(statisticObj.manager)
    if (thisManager === null)
      continue

    const dates = [...statisticObj.dates]
    const aum = [...statisticObj.aum]
    const portfolios = [...statisticObj.portfolios]

    if (statisticObj.last_update.getTime() > endOfPreviusDay.getTime()) {
      dates.pop()
      aum.pop()
      portfolios.pop()
    }    

    dates.push(date)
    aum.push(thisManager.aum)
    portfolios.push({
      active: await Request.countDocuments({manager: statisticObj.manager, status: 'active'}),
      archived: await Request.countDocuments({manager: statisticObj.manager, status: 'archived'}),
      inProgress: await Request.countDocuments({manager: statisticObj.manager, status: { $not: { $in: ['active', 'archived', 'failed']}}})
    })
    statistic.set({
      dates,
      aum,
      portfolios,
      last_update: Date.now()
    })

    const aum6m = [0, 0, 0, 0, 0, 0]
    for (let i = 0; i < 6; i++) {
      if (aum.length >= 30 * (5 - i)) {
        aum6m[i] = aum[aum.length - 1 - 30 * (5 - i)]
      }
    }
    const clients = await Request.aggregate
      ([
        {
          $match: {
            type: 'portfolio',
            manager: statisticObj.manager
          }
        },
        {
          $group : {
            _id : "$investor",
            count: { $sum: 1 }
          }
        }
      ])
    thisManager.set({aum6m, clients: clients.length === 0 ? 0 : clients.reduce((a, b) => a + b.count, 0)})
    await statistic.save()
    await thisManager.save()
  }
  const investors = await Investor.find()
  for (let investor of investors) {
    const managers_amount = await Request.aggregate
      ([
        {
          $match: {
            type: 'portfolio',
            investor: investor._id
          }
        },
        {
          $group : {
            _id : "$manager",
            count: { $sum: 1 }
          }
        }
      ])
    if (Date.now() - investor.last_active.getTime() > 1000 * 60 * 5) {
      investor.set({online: false})
    }
    investor.set({managers_amount: managers_amount.length === 0 ? 0 : managers_amount.reduce((a, b) => a + b.count, 0)})
    await investor.save()
  }
  resolve()
})
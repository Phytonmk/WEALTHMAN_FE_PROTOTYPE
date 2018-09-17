const Request = require('../../models/Request')
const Investor = require('../../models/Investor')
const Manager = require('../../models/Manager')
const Portfolio = require('../../models/Portfolio')
const ManagerStatistic = require('../../models/ManagerStatistic')
const InvestorStatistic = require('../../models/InvestorStatistic')
const calcComissions = require('../../helpers/calcComissions')

module.exports = () => new Promise(async (resolve, reject) => {
  const managerStatistics = await ManagerStatistic.find()
  for (let statistic of managerStatistics) {
    const statisticObj = statistic.toObject()
    const thisManager = await Manager.findById(statisticObj.manager)
    if (thisManager === null)
      continue

    let dates = [...statisticObj.dates]
    let aum = [...statisticObj.aum]
    let portfolios = [...statisticObj.portfolios]
    let commisions = [...statisticObj.commisions]

    for (let property of [aum]) {
      if (!property.length)
        property = []
      while (property.length < dates.length)
        property.unshift(0)
    }
    if (!portfolios.length)
      portfolios = []
    while (portfolios.length < dates.length)
      portfolios.unshift({
        active: 0,
        archived: 0,
        inProgress: 0
      })
    if (!commisions.length)
      commisions = []
    while (commisions.length < dates.length)
      commisions.unshift({
        accrued: 0,
        paid: 0
      })

    const date = new Date()
    const endOfPreviusDay = new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate()))
    if (statisticObj.last_update.getTime() > endOfPreviusDay.getTime()) {
      dates.pop()
      aum.pop()
      portfolios.pop()
      commisions.pop()
    }

    dates.push(date)
    aum.push(thisManager.aum)
    portfolios.push({
      active: await Request.countDocuments({manager: statisticObj.manager, status: 'active'}),
      archived: await Request.countDocuments({manager: statisticObj.manager, status: 'archived'}),
      inProgress: await Request.countDocuments({manager: statisticObj.manager, status: { $not: { $in: ['active', 'archived', 'failed']}}})
    })
    // console.log(`Updating commisions for manager ${thisManager.name} ${thisManager.surname}`)
    commisions.push(await calcComissions(thisManager))
    // console.log(commisions)
    statistic.set({
      dates,
      aum,
      portfolios,
      commisions,
      last_update: Date.now()
    })

    const portfoliosAmount = portfolios[portfolios.length - 1].active +
                              portfolios[portfolios.length - 1].archived +
                                portfolios[portfolios.length - 1].inProgress 
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
    thisManager.set({
      aum6m,
      clients: clients.length === 0 ? 0 : clients.reduce((a, b) => a + b.count, 0),
      portfolios: portfoliosAmount
    })
    await statistic.save()
    await thisManager.save()
  }
  const investorStatistics = await InvestorStatistic.find()
  for (let statistic of investorStatistics) {
    const statisticObj = statistic.toObject()
    const thisInvestor= await Investor.findById(statisticObj.investor)
    if (thisInvestor === null)
      continue


    let dates = [...statisticObj.dates]
    let aum = [...statisticObj.aum]
    let portfolios = [...statisticObj.portfolios]

    for (let property of [aum]) {
      if (!property.length)
        property = []
      while (property.length < dates.length)
        property.unshift(0)
    }
    if (!portfolios.length)
      portfolios = []
    while (portfolios.length < dates.length)
      portfolios.unshift({
        active: 0,
        archived: 0,
        inProgress: 0
      })

    const date = new Date()
    const endOfPreviusDay = new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate()))
    if (statisticObj.last_update.getTime() > endOfPreviusDay.getTime()) {
      dates.pop()
      aum.pop()
      portfolios.pop()
    }

    dates.push(date)
    aum.push(thisInvestor.aum)
    portfolios.push({
      active: await Request.countDocuments({investor: statisticObj.investor, status: 'active'}),
      archived: await Request.countDocuments({investor: statisticObj.investor, status: 'archived'}),
      inProgress: await Request.countDocuments({investor: statisticObj.investor, status: { $not: { $in: ['active', 'archived', 'failed']}}})
    })

    statistic.set({
      dates,
      aum,
      portfolios,
      last_update: Date.now()
    })

    const managers_amount = await Request.aggregate
      ([
        {
          $match: {
            type: 'portfolio',
            investor: thisInvestor._id
          }
        },
        {
          $group : {
            _id : "$manager",
            count: { $sum: 1 }
          }
        }
      ])
    if (Date.now() - thisInvestor.last_active.getTime() > 1000 * 60 * 5) {
      thisInvestor.set({online: false})
    }
    const portfoliosAmount = await Request.countDocuments({investor: thisInvestor._id, type: 'portfolio'})
    thisInvestor.set({
      managers_amount: managers_amount.length === 0 ? 0 : managers_amount.reduce((a, b) => a + b.count, 0),
      portfolios: portfoliosAmount
    })
    await statistic.save()
    await thisInvestor.save()
  }
  resolve()
})
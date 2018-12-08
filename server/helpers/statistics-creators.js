const ManagerStatistic = require('../models/ManagerStatistic')
const InvestorStatistic = require('../models/InvestorStatistic')
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
module.exports = { createManagersStatistics, createInvestorStatistics }
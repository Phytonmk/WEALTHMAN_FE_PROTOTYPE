const Investor = require('../../models/Investor')
const Manager = require('../../models/Manager')
const ManagerStatistic = require('../../models/ManagerStatistic')
const InvestorStatistic = require('../../models/InvestorStatistic')
const { createManagersStatistics, createInvestorStatistics } = require('../../helpers/statistics-creators')

module.exports = () => new Promise(async (resolve, reject) => {
  const managers = await Manager.find()
  for (let manager of managers) {
    const connectedStatistics = await ManagerStatistic.find({ manager: manager._id })
    if (connectedStatistics.length === 0) {
      await createManagersStatistics(manager._id)
    }
  }
  const investors = await Investor.find()
  for (let investor of investors) {
    const connectedStatistics = await InvestorStatistic.find({ investor: investor._id })
    if (connectedStatistics.length === 0) {
      await createInvestorStatistics(investor._id)
    }
  }
  resolve()
})
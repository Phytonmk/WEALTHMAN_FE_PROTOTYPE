const Request = require('../../models/Request');
const Manager = require('../../models/Manager')
const ManagerStatistic = require('../../models/ManagerStatistic')

module.exports = () => new Promise(async (resolve, reject) => {
  const date = new Date()
  const endOfPreviusDay = new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate()))
  console.log(endOfPreviusDay)
  const statistics = await ManagerStatistic.find({ last_update: { $lt: endOfPreviusDay } })
  for (let statistic of statistics) {
    const statisticObj = statistic.toObject()
    const dates = [...statisticObj.dates]
    const aum = [...statisticObj.aum]
    const portfolios = [...statisticObj.portfolios]
    dates.push(date)
    aum.push(Math.round(Math.random() * 500))
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
    await statistic.save()
  }
  resolve()
})
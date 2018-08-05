const Request = require('../../models/Request');
const Manager = require('../../models/Manager')
const ManagerStatistic = require('../../models/ManagerStatistic')

module.exports = () => new Promise(async (resolve, reject) => {
  const date = new Date()
  const endOfPreviusDay = new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate()))
  // const statistics = await ManagerStatistic.aggregate([
  //    { $project: { id: 1, dates: 1, aum: 1, portfolios: 1, date: { $slice: [ "$dates", -1 ] } } },
  //    { $match: { date: { $lt: currentDay } } }
  // ]);
  const statistics = await ManagerStatistic.find({ lastUpdate: { $lt: endOfPreviusDay } })
  for (let statistic of statistics) {
    const dates = [...statistic.dates]
    const aum = [...statistic.aum]
    const portfolios = [...statistic.portfolios]
    dates.push(currentDay)
    aum.push(Math.round(Math.random() * 500))
    portfolios.push({
      active: await Request.countDocuments({manager: statistic.manager, staus: 'active'}),
      archived: await Request.countDocuments({manager: statistic.manager, staus: 'archived'}),
      inProgress: await Request.countDocuments({manager: statistic.manager, staus: { $not: { $in: ['active', 'archived', 'failed']}}})
    })
    statistic.set({
      dates,
      aum,
      portfolios,
      lastUpdate: Date.now()
    })
    await statistic.save()
  }
  resolve()
})
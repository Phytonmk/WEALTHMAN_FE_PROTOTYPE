const Manager = require('../../models/Manager')
const ManagerStatistic = require('../../models/ManagerStatistic')

module.exports = (app) => {
  // Получить список всех менеджеров
  app.get('/api/managers', async (req, res, next) => {
    const managers = await Manager.find({})
    res.status(200)
    res.send(managers)
    res.end()
  })
  // Получить информацию о менеджере
  app.get('/api/manager/:id', async (req, res, next) => {
    console.log(req.params.id)
    const manager = await Manager.findById(req.params.id)
    if (manager === null) {
      res.status(404)
      res.end()
      return
    }
    const statistics = await ManagerStatistic.findOne({manager: manager._id})
    res.status(200)
    res.send(Object.assign(manager.toObject(), {
      aumDynamics: {
        values: statistics.aum,
        dates: statistics.dates,
      }
    }))
    res.end()
  })
  // Получить больше информации о менеджере
  app.get('/api/manager-statistics/:id', async (req, res, next) => {
    const manager = await Manager.findById(req.params.id)
    if (manager === null) {
      res.status(404)
      res.end()
      return
    }
    const profitability = Math.ceil(Math.random() * 100)
    const clients = Math.ceil(Math.random() * 100)
    const portfolios = Math.ceil(Math.random() * 100)
    res.status(200)
    res.send({
      profitability,
      clients,
      portfolios
    })
    res.end()
  })
  app.post('/api/increment-manager-views/:id', async (req, res, next) => {
    const manager = await Manager.findById(req.params.id)
    if (manager === null) {
      res.status(404)
      res.end()
      return
    }
    const currentManagerViews = manager.views || 0
    manager.set({ views: currentManagerViews + 1 })
    await manager.save()
    res.status(200)
    res.end()
  })
}
const Investor = require('../../models/Investor');
const Manager = require('../../models/Manager');
const Company = require('../../models/Company');

const RANDOM = () => Math.round(100 * Math.random());

module.exports = (app) => {
  // Получить данные для отображения на маркетплейсе
  app.get('/api/marketplace/:filter', async (req, res, next) => {
    const totalInvestors = await Investor.countDocuments({});
    const totalManagers = await Manager.countDocuments({});
    
    const totalAum = RANDOM();

    let searchQuery = {company: null, $where: 'this.services.length > 0' };
    if (req.params.filter !== '-1')
      searchQuery['services.type'] = req.params.filter;
    if (req.query['only-from-company'] !== undefined)
      searchQuery.company = req.query['only-from-company'];
    let offers = []
    if (!req.query['only-companies'])
      offers = await Manager.find(searchQuery);

    if (req.query['only-single-managers'] !== 'true' && req.query['only-from-company'] === undefined || req.query['only-companies']) {
      searchQuery = {$where: 'this.services.length > 0' };
      if (req.params.filter !== '-1')
        searchQuery['services.type'] = req.params.filter;
      const companies = await Company.find(searchQuery);
      offers = offers.concat(companies);
    }

    for (let o in offers) {
      offers[o] = offers[o].toObject();
      // offers[o].clients = RANDOM();
      // offers[o].aum = RANDOM();
      offers[o].successRate = RANDOM() / 10;
      // Also make it in more fast way
    }
    res.send({totalInvestors, totalManagers, totalAum, offers})
  });
}
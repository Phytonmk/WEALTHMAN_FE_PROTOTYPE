// const Manager = require('../../models/Manager');

const Eth = require('web3-eth');

module.exports = (app) => {
  app.get('/api/new-wallet-address', async (req, res, next) => {
    const eth = new Eth(Eth.givenProvider);
    console.log(eth);
  });
  // app.get('/api/managers', async (req, res, next) => {
  //   const managers = await Manager.find({})
  //   res.status(200);
  //   res.send(managers);
  //   res.end();
  // });
  // app.get('/api/manager/:id', async (req, res, next) => {
  //   console.log(req.params.id);
  //   const manager = await Manager.findOne({id: req.params.id});
  //   if (manager === null) {
  //     res.status(404);
  //     res.end();
  //     return;
  //   }
  //   res.status(200);
  //   res.send(manager);
  //   res.end();
  // });
}
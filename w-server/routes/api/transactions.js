// const Token = require('../../models/accessToken')
// const Investor = require('../../models/Investor')
// const Transaction = require('../../models/Transaction')


module.exports = (app) => {
  // app.post('/api/transactions/:request', async (req, res, next) => {
  //   const token = await Token.findOne({token: req.body.accessToken})
  //   if (token === null) {
  //     res.status(403)
  //     res.end('')
  //     return
  //   }
  //   const query = await getRequestQueryByToken(token)
  //     .catch(status => {
  //       res.status(status)
  //       res.end()
  //     })
  //   if (!query) 
  //     return
  //   const request = await Request.findById(req.body.request).where(query)
  //   if (request === null) {
  //     res.status(404)
  //     res.end()
  //     return
  //   }
  //   const
  //   res.status(200)
  //   res.end()
  // })
}


const getRequestQueryByToken = (token) => new Promise(async (resolve, reject) => {
  let user;
  let userID;
  let manager;
  let company;
  const investor = await Investor.findOne({user: token.user});
  if (investor === null) {
    manager = await Manager.findOne({user: token.user});
    if (manager === null) {
      company = await Company.findOne({user: token.user});
      if (company === null) {
        reject(403);
        return;
      } else {
        user = 'company';
        userID = company.id;
      }
    } else {
      user = 'manager';
      userID = manager.id;
    }
  } else {
    user = 'investor';
    userID = investor.id;
  }
  resolve({[user]: userID});
});
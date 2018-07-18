const apiURL = 'https://api-rinkeby.etherscan.io';
// const token = 'BNJX7XSCHMS4KBD3ZS96PSCPV7BBCF3KC4';

const Request = require('../../models/Request');
const Portfolio = require('../../models/Portfolio');
const axios = require('axios');

let workingProcess = false;

const work = async () => {
  if (workingProcess)
    return false;
  workingProcess = true;

  const requests = await Request.find({status: 'waiting for transaction'});
  const smartContracts = [];
  let i = 0;
  for (request of requests) {
    const portfolio = await Portfolio.findOne({request: request.id});
    if (portfolio !== null && portfolio.smart_contract)
      smartContracts.push({
        address: portfolio.smart_contract,
        portfolio: portfolio.id,
        request: request.id
      });
  }
  // for (let smartContract of smartContracts) {
  //   const res = await axios.get(`${apiURL}/api?module=transaction&action=gettxreceiptstatus&txhash=${smartContract.address}&apikey=${token}`)
  //     .catch((err) => {console.log('Error occurred', err)});
  //   const data = res.data;
  //   console.log(data, smartContract.address);
  // }
}



work();
let interval = setInterval(work, 1000 * 60 * 15);
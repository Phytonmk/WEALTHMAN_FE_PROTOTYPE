const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const exchangerAbi = require('./exchanger_abi.js');
const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws'))
const admin = "0x6e3F0CC77BF9A846e5FD4B07706bf8ca95493d4D";
var exchange_prices = []
var order_num;
//0x70be6b51cbfD678551511bb7532bb9f2dA478794
var exchanger_contract = new web3.eth.Contract(exchangerAbi, '0x2318fdfaa7182875e9278cd3ffe01435afe27726');
var event = exchanger_contract.events.NewTrade({fromBlock: 0,
  toBlock: 'latest'}, function(error, event){
    exchanger_contract.getPastEvents('NewTrade',{fromBlock: 0,
      toBlock: 'latest'}, function(error, event) {
        if (error)
          console.log(error);
        else
          order_num = event.length - 1
      })
    var teb3= new  Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/5c95df77f8994b7bb81f9d7dcf1dc252'))
    var complete_functionAbi = exchanger_contract.methods.completeOrders([order_num],[2000000000000000000]).encodeABI();
    const getNonce = () => {
      return new Promise((resolve, reject) => {
        teb3.eth.getTransactionCount(admin, (error, result) => {
          if(error) reject(error);
          resolve(result);
        })
      })
    }
    const getGasPrice = () => {
      return new Promise((resolve, reject) => {
        teb3.eth.getGasPrice((error, result) => {
          if(error) reject(error);
          resolve(result);
        })
      })
    }
    const getGasLimit = (functionAbi) => {
    return new Promise((resolve, reject) => {
      web3.eth.estimateGas({data:functionAbi},(error, result) => {
        if(error) reject(error);
        resolve(result);
      })
    })
    } 
    const sendRawTransaction = (rawTx) => {
      const privateKey = "4a131e9f1843d982cd3a4b83749b46bcd2435b5e19429109a16d2f144bd5d948";
      const tx = new Tx(rawTx);
      const privateKeyBuffer = Buffer.from(privateKey, 'hex');
      tx.sign(privateKeyBuffer);
      const serializedTx = tx.serialize();
      teb3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
        console.log('Error:', err);
        console.log('Hash:', hash);
      });
    }

    Promise.all([getNonce(), getGasPrice(), getGasLimit(portfolioAbi)])
    .then(values => {
      const rawTx = {
        to: exchanger_adress,
        gasLimit: teb3.utils.toHex(values[2]),
        nonce: teb3.utils.toHex(values[0]),
        gasPrice: teb3.utils.toHex(Number(values[1])),
        data: item
      };
      console.log(rawTx);
      return(rawTx);
    })
    .then(sendRawTransaction)
    .catch(e => console.log(e))
})

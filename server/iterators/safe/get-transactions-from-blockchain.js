module.exports = () => new Promise(a => a())
/*const Request = require('../../models/Request')
const Transaction = require('../../models/Transaction')
const RawTransaction = require('../../models/RawTransaction')
const Portfolio = require('../../models/Portfolio')

const configs = require('../../configs')

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(configs.web3httpProvider))

module.exports = () => new Promise(async (resolve, reject) => {
  // const portfolios = await Portfolio.find({
  //   state: 'active',
  //   smart_contract: { $exists: true }
  // })
  // // resolve()
  // const contracts = []
  // for (let portfolio of portfolios) {
  //   if (portfolio.smart_contract !== '-')
  //     contracts.push(portfolio.smart_contract)
  // }
  const lastTransaction = await RawTransaction.find().sort({ block: -1 }).limit(1)
  const currentBlock = await new Promise((resolve, reject) => web3.eth.getBlockNumber((err, res) => err ? reject(err) : resolve(res)))
  const startBlock = lastTransaction.length === 0 ? 2766403 : lastTransaction[0].block
  for (let i = startBlock; i < currentBlock; i++) {
    const block = await new Promise((resolve, reject) => web3.eth.getBlock(i, true, (err, res) => {
      if (err) {
        console.log(err)
      } else {
        resolve(res)
      }
    }))
    // console.log(`===============`)
    // console.log(`Reading block ${i} which created at ${new Date(block.timestamp * 1000)} ${i - startBlock}/${currentBlock - startBlock} (${Math.round((i - startBlock)/(currentBlock - startBlock) * 100)})`)
    let foundTransactions = 0
    if (block && block.transactions) {
      for (let transaction of block.transactions ) {
        const portfolio = await Portfolio.findOne({ 
          $or: [{
            smart_contract: new RegExp(transaction.from, 'i')
          }, {
            smart_contract: new RegExp(transaction.to, 'i')
          }]
        })
        // if (transaction.to.toLowerCase() === '0x511d214a4eDc16084D0f3BFb3B8FB733086e24cE'.toLowerCase()) {
        //   console.log(transaction)
        //   console.log(platformContract)
        // }
        if (portfolio !== null) {
          const smartContract = portfolio.smart_contract
          const thisRawTransaction = await RawTransaction.findOne({
            smart_contract: smartContract,
            request: portfolio.request,
            block: i,
            index: transaction.transactionIndex
          })
          if (thisRawTransaction === null) {
            console.log(`New transaction! ${i}:${transaction.transactionIndex}`)
            const newTransaction = new RawTransaction({
              smart_contract: smartContract,
              request: portfolio.request,
              block: i,
              index: transaction.transactionIndex,
              date: new Date(block.timestamp * 1000),
              data: transaction
            })
            await newTransaction.save()
            foundTransactions++
          }
          // const transactionData = {
          //   contract: String,
          //   request: String,
          //   date: new Date(block.timestamp * 1000),
          //   type: String,
          //   receiver: {
          //     name: String,
          //     type: String,
          //     id: String
          //   },
          // }
        }
      }
    }
    if (foundTransactions === 0) {
      await RawTransaction.findOneAndUpdate({
        smart_contract: 'transaction-of-last-checked-block'
      }, {
        smart_contract: 'transaction-of-last-checked-block',
        block: i,
        data: 'This document is not a real ethereum transaction but just a system document which represents last checked block'
      }, {upsert:true})
    }
    // console.log(`Found ${foundTransactions} new transactions on block ${block.number}`)
  }
})*/
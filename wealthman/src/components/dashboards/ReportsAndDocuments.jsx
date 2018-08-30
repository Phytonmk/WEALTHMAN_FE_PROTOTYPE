const testnet = false

import React, { Component } from 'react';

import Subheader from '../Subheader'
import Sortable2 from '../Sortable2'
import LevDate from '../LevDate'
import { api } from '../helpers'

export default class ReportsAndDocuments extends Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [],
    }
  }
  componentDidMount() {
    if (this.props.request) {
      api.get('request/history/' + this.props.request)
        .then((res) => {
          console.log(res.data)
          this.setState({history: res.data})
        })
        .catch(console.log)
    }
  }
  render() {
    console.log(this.props.transactions)
    return <div className="reports-and-documents-box">
      <div className="box">
        <h3>Reports & Documents</h3>
        <Subheader
          data={[
            {
              header: 'Transactions',
              content: (!this.props.transactions || this.props.transactions.length === 0) ? 'no data' : <Sortable2
                columns={transactionsHeader}
                data={this.props.transactions.map(transaction => {return {
                  id: transaction.block + ':' + transaction.index,
                  hash: {
                    render: <a className="blue" href={`https://${testnet ? 'rinkeby.' : ''}etherscan.io/tx/${transaction.data.hash}`}>{transaction.data.hash}</a>, 
                    value: transaction.data.hash
                  },
                  block: {
                    render: <a className="blue" href={`https://${testnet ? 'rinkeby.' : ''}etherscan.io/block/${transaction.data.blockNumber}`}>{transaction.data.blockNumber}</a>, 
                    value: transaction.data.blockNumber
                  },
                  age: {
                    render: new LevDate(transaction.date).pastNice(),
                    value: new Date(transaction.date).getTime()
                  },
                  from: {
                    render: <a className="blue" href={`https://${testnet ? 'rinkeby.' : ''}etherscan.io/address/${transaction.data.from}`}>{transaction.data.from}</a>, 
                    value: transaction.data.from
                  },
                  to: {
                    render: <a className="blue" href={`https://${testnet ? 'rinkeby.' : ''}etherscan.io/address/${transaction.data.to}`}>{transaction.data.to}</a>, 
                    value: transaction.data.to
                  },
                  value: {
                    value: transaction.data.value / 1000000000000000000,
                    render: transaction.data.value / 1000000000000000000 + ' Ether'
                  },
                  fee: transaction.data.gas * transaction.data.gasPrice / 1000000000000000000,
                }})}
              />
            },{
              header: 'Agreements',
              content: 'no data'
            },{
              header: 'History',
              content: this.state.history.length === 0 ? 'no data' : this.state.history.map(transaction => 
                <div className="request-history-block">
                  <div className="request-history-text">
                    <h4>{transaction.title}</h4>
                    <p>{transaction.subtitle}</p>
                  </div>
                  <div className="request-history-date">
                    {new LevDate(transaction.date).niceTime()}
                  </div>
                </div>)
            }
          ]}
        />
      </div>
    </div>
  }
}
//TxHash  Block Age From    To  Value [TxFee]
const transactionsHeader = [
  {
    property: "hash",
    title: "TxHash",
    width: "200px",
  },
  {
    property: "block",
    title: "Block",
    width: "75px",
  },
  {
    property: "age",
    title: "Age",
    width: "75px",
  },
  {
    property: "from",
    title: "From",
    width: "100px",
  },
  {
    property: "to",
    title: "To",
    width: "100px",
  },
  {
    property: "value",
    title: "Value",
    width: "100px",
  },
  {
    property: "fee",
    title: "[TxFee]",
    width: "50px",
    tooltip: '(GasPrice * GasUsed By Txn) in Ether'
  }
]

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getCookie, niceNumber, setPage, api } from '../helpers';
import Modal from '../Modal'

export default class InvstorPortfolioHeader extends Component {
  render() {
    if (this.props.dashboardMode)
      return <div className="investor-portfolio-header">
          <div>
            <h1>Portfolios</h1>
          </div>
          <div>
            <div>
              <h2>{this.props.value || ''}</h2>
              <p>Total balance</p>
            </div>
            {(getCookie('usertype') != 0 ? '' : (<Link to={"/"}>
              <button className="big-blue-button money-button">Deposit</button>
            </Link>))}
          </div>
        </div>
    else
      return <div className="investor-portfolio-header">
        <div>
          <h1>Active portfolio</h1>
          <p>#{this.props.requestData.request._id}</p>
        </div>
        <div>
          <div>
            <h2>{this.props.requestData.portfolio.balance} ETH</h2>
            <p>Total balance</p>
          </div>
          {this.props.requestData.request.status === 'active' &&
            <RequestWithdraw
              request={this.props.requestData.request._id}
              address={this.props.requestData.portfolio.smart_contract}
              />}
          {this.props.requestData.request.status === 'waiting for withdraw' &&
            <Withdraw
              request={this.props.requestData.request._id}
              address={this.props.requestData.portfolio.smart_contract}
              />}
        </div>
      </div>
  }
}


class RequestWithdraw extends Component {
  constructor(props) {
    super(props)
    this.hideModal = () => {}
  }
  sellTokens() {
    api.post('sell-tokens', {request: this.props.request})
      .then(() => {
        this.hideModal()
        setPage('requests')
      })
      .catch(console.log)
  }
  render() {
    return <Modal
      hider={(func) => this.hideModal = func}
      button="Request Withdraw"
      btnClassName="big-blue-button money-button"
      buttons={[{type: 'blue', text: 'Sell tokens', action: () => this.sellTokens()}]}
      >
        <h1>Request withdrawing of portfolio</h1>
        <br/>
        <small>#{this.props.request}</small>
        <br/>
        <p>All tokens on the <b>{this.props.address}</b> will be exchanged to the ethereum</p>
      </Modal>
  }
}
import { abi as contractAbi } from '../smart-contract-data';
class Withdraw extends Component {
  constructor(props) {
    super(props)
    this.hideModal = () => {}
  }
  openMetaMask() {
    try {
      const contract = web3.eth.contract(contractAbi)
      const myContractInstance = contract.at(this.props.address);
      myContractInstance.withdraw(() => this.hideModal());
    } catch (e) {
      alert('Seems like you are not Logged In MetaMask')
    }
  }
  render() {
    return <Modal
      hider={(func) => this.hideModal = func}
      button="Withdraw"
      btnClassName="big-blue-button money-button"
      buttons={[{type: 'blue', text: 'Withdraw', action: () => this.openMetaMask()}]}
      >
        <h1>Withdraw ethereum</h1>
        <br/>
        <small>#{this.props.request}</small>
        <br/>
        <p>All ethereum will be withdrawed from smart contract <b>{this.props.address}</b> to address which was specified before deploying</p>
      </Modal>
  }
}
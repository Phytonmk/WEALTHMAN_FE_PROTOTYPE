import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ProgressBar from '../ProgressBar'
import QRCode from 'qrcode.react';


import { api, getCookie, setCookie, newLines, setPage, previousPage } from '../helpers';

import { abi, bytecode, contract, _exchanger, _admin } from '../smart-contract-data';

class Timer extends Component {
  constructor(props) {
    super(props);
    //this.props.duration
    this.state = {
      left: new Date().getTime() - new Date(this.props.start).getTime()
    }
  }
  componentWillMount() {
    setInterval(() => {
      this.setState({left: this.state.left - 1000});
    }, 1000);
  }
  render() {
    if (!this.props.start)
      return <div>∞</div>
    const date = new Date(this.state.left);
    return <div>{date.getHours()}:{(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}:{(date.getSeconds() < 10 ? '0' : '') + date.getSeconds()}</div>
  }
}

class MoneyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gotData: false,
      status: 0,
      contractAddress: '',
      request: {},
      deploymentCost: ''
    };
  }
  componentWillMount() {
    api.post('get-request/' + this.props.match.params.id)
      .then((res) => {
        let status = 5;
        let contractAddress = '';
        if (res.data.request.status === 'proposed')
          status = 0;
        if (res.data.request.status === 'deploying')
          status = 1;
        if (res.data.request.status === 'waiting for deposit') {
          status = 2;
          console.log(res.data);
          contractAddress = res.data.portfolio.smart_contract;
        }
        this.setState({
          gotData: true,
          status, contractAddress, request: res.data.request
        })
      })
      .catch(console.log)
    api.get(`contract-cost/${this.props.match.params.id}/deploy`)
      .then((res) => {
        this.setState({deploymentCost: res.data})
      })
      .catch(console.log)
  }
  deploy() {
    if (!this.props.userData.wallet_address || this.props.userData.wallet_address.length < 10) {
      alert(`Your wallet address ${this.props.userData.wallet_address} seems not to be valid ethereum wallet address\nPlease, fill valid one in your account settingsz`)
      return
    }
    api.post('contracts/deploy', {
      request: this.state.request._id,
      manager: this.state.request.manager
    }).then((res) => {
      console.log(res.status);
      this.setState({status: 1})
    }).catch(console.log);
  }
  useMetaMask() {
    const contract = web3.eth.contract(abi);
    const contractInstance = contract.at(this.state.contractAddress);
    contractInstance.deposit({value: web3.toWei(this.state.request.value.toString(),'ether'), gas: 760000/*7600000*/, gasPrice: 2000000000},function(err, transactionHash) {
      if (!err)
        console.log(transactionHash);
      else
        console.log(err)
    })
    // this.setState({status: 4})
  }
  render() {
    if (!this.state.gotData)
      return <div className="box loading"><p>Loading</p></div>
    if (this.state.status === 0) {
      return <div className="container">
            <div className="box">
              <h2> Contract deploying </h2>
              <div className="row">
                {/*Before you continue, please download <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank">Metamask</a> to your browser and log in to the extention through the private key.
                <div className="row">
                  <div className="metamask" />
                </div>*/}
                <p>
                  Pressing "Deploy" you confirm terms of your portfolio. After contract is deployed you cannot change its terms otherwise you have to form it newly.<br/>
                  The status of contract and portfolio you can easily find in Portfolio page.
                </p>
                {this.state.deploymentCost ? <p>
                  This opertaion will cost <b>{this.state.deploymentCost}</b> $
                </p> : <p>
                  Calculating cost of deploying...
                </p>}
                <div className="row">
                  <Link to={"/request/" + this.props.match.params.id}>
                    <button className="back">Back</button>
                  </Link>
                  <button className="continue" onClick={() => this.deploy()}>Deploy</button>
                </div>
              </div>
            </div>
          </div>
    }
    if (this.state.status === 1) {
      if (typeof web3 === 'undefined')
        return  <div className="container">
            <div className="box">
              <h2> Install MetaMask and reload page </h2>
            </div>
          </div>
      else
        return <div className="container">
            <div className="box">
              <h2>Etherium network is mining the transaction<br/>Check your portfolio status in 5 minutes</h2>
              <Link to={"/requests"}>
                <button className="back">Back to portfolios</button>
              </Link>
            </div>
          </div>
    }
    if (this.state.status === 3) {
      return <div className="container">
               <div className="box">
                 <h2> You have rejected the contract, please, contact with you manager </h2>
               </div>
             </div>
    }
    if (this.state.status === 5) {
      return <div className="container">
              <div className="box">
                <h2> Error occurred :'( </h2>
              </div>
            </div>
    }
    const value = this.state.request.value
    return (
      <div>
        {/* {this.renderBackButton()} */}
        <div className="container">
          <div className="box">
            <h2>Deposit money</h2>
            <div className="row">
              <button className="show-code" onClick={() => setReduxState({showCode: !this.props.showCode})}>{this.props.showCode ? "Hide" : "Show"} Smart-contract code</button>
              <div className={"code-container " + (this.props.showCode ? "show" : "hide")}>
                {newLines(this.props.code)}
              </div>
            </div>
            <div className="row">
              <h2>Attention</h2>
              <p>This interface allows you to deposit money on deployed contract<br/>
              After you transfer <b>{value}</b> ETH to smart contract exchange operations will be launched<br/>
              You can track all transactions of via Etherscan or Portfolio page<br/>
              To withdraw money from portfolio you should click Withdraw button on the portfolio page</p>
              <p>Please use metamask to make deposit preliminary switch it to Main Etherium network<br/>
              The portfolio value you input in portfolio target form is <b>{value}</b> ETH</p>
            </div>
            <div className="row">
              <button className="continue" href="" onClick={() => this.useMetaMask()}>Use MetaMask</button>
            </div>
            <div className="row">
              <small>
                Make sure that you logged in metamask and your wallet is coincided with address specified in Account settings<br/>
                Switch Metamask to Main Etherium network<br/>
                Wallet balance should be not less than {value} ETH<br/>
                Please, press the Deposit button<br/>
                When metamask window is poped up check parameters and push Submit button<br/>
                Check transaction and portfolio status at Etherscan or Portfolio page
              </small>
            </div>
            <div className="row-padding">
              <Link to={"/request/" + this.props.match.params.id}>
                <button className="back">Back</button>
              </Link>
              <Link to={"/requests"}>
                <button className="continue right">Finish</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(a => a)(MoneyPage)
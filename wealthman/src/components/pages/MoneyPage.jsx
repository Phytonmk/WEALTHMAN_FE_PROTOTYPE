import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ProgressBar from '../ProgressBar.jsx'

import { api, getCookie, setCookie, newLines, setPage, prevousPage } from '../helpers';

import { abi, bytecode, contract, _exchanger, _admin } from '../smart-contract-data';

class MoneyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 0, // status 0 -- page loaded; 1 -- metamask opened; 2 -- contract accepted; 3 -- contract rejected
      contractAddress: ''
    };
  }
  openMetamask() {
    if (typeof web3 === 'undefined') {
      return;
    }
    api.post('get-smart-contract-data', {request: this.props.match.params.id})
      .then(res => {
        const _owner = res.data.investor;
        const _manager = res.data.manager;
        const _endTime = 1538784000;
        const _tradesMaxCount = 2;
        const _managmentFee = 200 ;
        const _performanceFee =500;
        const _frontFee = 100 ;
        const _exitFee = 100;
        const _mngPayoutPeriod = 7 ;
        const _prfPayoutPeriod =30;
        const portfolioContract = web3.eth.contract(contract);
        const portfolio = portfolioContract.new(
         _owner,
         _manager,
         _exchanger,
         _admin,
         _endTime,
         _tradesMaxCount,
         _managmentFee,
         _performanceFee,
         _frontFee,
         _exitFee,
         _mngPayoutPeriod,
         _prfPayoutPeriod,
         {
          from: web3.eth.accounts[0],
          data: bytecode,
          gas: '4700000'
         },
         (error, contract) => {
            if (error) {
              console.log(error);
              this.setState({status: 3});
            } else if (typeof contract.address !== 'undefined') {
              console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
              this.setState({status: 2, contractAddress: contract.address});
              api.post('set-smart-contract', {contractAddress: contract.address, request: this.props.match.params.id})
                .then(() => console.log('ok'))
                .catch(console.log);
            } else {
              console.log(`contract: ${contract.address}`);
              this.setState({status: 1});
            }
         }
        )
      }).catch(console.log);
  }
  finish() {
    // api.post('portfolio-formating', {request: this.props.match.params.id})
    //   .then(() => {setPage('portfolios')})
    //   .catch(console.log);
    web3 = new Web3(web3.currentProvider);
    var contract = web3.eth.contract(abi);
    var contractInstance = contract.at('0x38C937dF579406C9F2725d846e50b91880575A65');
    var a =contractInstance.trade(['0x0'], ["0xD626F6CdF102b18fc9FF16013443428490EC4E53"], ['1000'],function(err, transactionHash) {
      if (err)
        console.log(err);
      else
        setPage('portfolios')
    })
  
  }
  render() {
    if (this.state.status === 0) {
      return <div className="container">
            <div className="box">
              <h2> Contract deploying </h2>
              <div className="row">
                <ol type="1">
                  <li>
                    To deploy smart contract install MetaMask in your current browser
                  </li>
                  <li>
                    Be sure that you are logged in MetaMask
                  </li>
                  <li>
                    Be sure that you have enough Ethereum to pay commission
                  </li>
                  <li>
                    Push the button below
                  </li>
                </ol>
                <div className="row">
                  <button className="continue" onClick={() => this.openMetamask()}>Open MetaMask</button>
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
              <h2> Waiting... </h2>
            </div>
          </div>
    }
    if (this.state.status === 3) {
      return <div className="container">
            <div className="box">
              <h2> Error occured, maybe you rejected contract </h2>
            </div>
          </div>
    }
    return (
      <div>
        {/* {this.renderBackButton()} */}
        <div className="container">
          <div className="box">
            <h2>Send Money</h2>
            <div className="row">
              <button className="show-code" onClick={() => setReduxState({showCode: !this.props.showCode})}>{this.props.showCode ? "Hide" : "Show"} Smart-contract code</button>
              <div className={"code-container " + (this.props.showCode ? "show" : "hide")}>
                {newLines(this.props.code)}
              </div>
            </div>
            <div className="row">
              <ol type="1">
                <li>
                  Please choose your Ethereum wallet
                </li>
                <li>
                  Check that you have enough money on it to invest
                </li>
                <li>
                  Copy this address of smart-contract <b className="eth-address">{this.state.contractAddress}</b>
                </li>
                <li>
                  Go to your Ethereum wallet and paste the address of smart-contract as destination address
                </li>
                <li>
                  Submit the money transfer
                </li>
              </ol>
            </div>
            <div className="row-padding">
              As soon as transaction is accomplished you can follow the details and statistics at <Link to={"/portfolios"} onClick={() => this.setPage("portfolios")}>Portfolio page</Link>
            </div>
            <div className="row-padding">
              <button className="back" onClick={() => prevousPage()}>Back</button>
              <button className="continue" onClick={() => this.finish()}>Finish</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(a => a)(MoneyPage)
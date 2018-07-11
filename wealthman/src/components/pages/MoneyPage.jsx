import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ProgressBar from '../ProgressBar.jsx'

import { api, getCookie, setCookie, newLines, setPage, prevousPage } from '../helpers';

import { bytecode, contract, _exchanger, _admin } from '../smart-contract-data';

class MoneyPage extends Component {
  constructor(props) {
    super(props);
  
    this.state = {};
  }
  componentWillMount() {
    if (typeof web3 === 'undefined') {
      alert('Metamask not found');
      return;
    }
    api.post('get-smart-contract-data', {request: this.props.match.params.id})
      .then(res => {
        console.log(res.data);
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
         (e, contract) => {
           if (typeof contract.address !== 'undefined') {
             console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
           }
         }
        )
      }).catch(console.log);
  }
  render() {
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
                  Copy this address of smart-contract <b className="eth-address">0x3a8b4013eb7bb370d2fd4e2edbdaf6fd8af6a862</b>
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
              <Link to="/signagreement">
                <button className="back" onClick={() => this.prevousPage()}>Back</button>
              </Link>
              <Link to="/portfolios">
                <button className="continue" onClick={() => this.setPage("portfolios")}>Finish</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(a => a)(MoneyPage)
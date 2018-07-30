import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ProgressBar from '../ProgressBar.jsx'
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
      status: 0, // status 0 -- page loaded; 1 -- deploying; 2 -- contract accepted; 3 -- contract rejected; 4 -- error
      contractAddress: '',
      request: {},
    };
  }
  componentWillMount() {
    api.post('get-request/' + this.props.match.params.id)
      .then((res) => {
        let status = 4;
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
  }
  deploy() {
    api.post('contracts/deploy', {
      request: this.state.request._id,
      manager: this.state.request.manager
    }).then((res) => {
      console.log(res.status);
      this.setState({status: 1})
    }).catch(console.log);
  }
  finish() {
    web3.eth.sendTransaction({
      from: this.props.userData.wallet_address,
      to: this.state.contractAddress,
      value: web3.toWei(this.state.request.value.toString(), 'ether'),
      gas: 7600000,
      gasPrice: 1
    }, console.log)
    .then(function(receipt){
      console.log(receipt);
    });
    
    // var contract = web3.eth.contract(abi);
    // var contractInstance = contract.at(this.state.contractAddress);
    // var a = contractInstance.deposit({value: web3.toWei(this.state.request.value.toString(), 'ether'), gas: 50000}, (err, transactionHash) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log(transactionHash);
    //     setPage('requests');
    //   }
    // });

    // web3 = new Web3(web3.currentProvider);
    // var contract = web3.eth.contract(abi);
    // var contractInstance = contract.at('0x38C937dF579406C9F2725d846e50b91880575A65');
    // var a =contractInstance.trade(['0x0'], ["0xD626F6CdF102b18fc9FF16013443428490EC4E53"], ['1000'],function(err, transactionHash) {
    //   if (err)
    //     console.log(err);
    //   else
    //     setPage('portfolios')
    // })
  
  }
  render() {
    if (!this.state.gotData)
      return <div className="box loading"><p>Loading</p></div>
    if (this.state.status === 0) {
      return <div className="container">
            <div className="box">
              <h2> Contract deploying </h2>
              <div className="row">
                <ol type="1">
                  <li>
                    To deploy smart contract just push the button below
                  </li>
                </ol>
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
              <h2>Relax<br/>Etherium network mines the transaction<br/>Check your portfolio status in 5 minutes</h2>
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
    if (this.state.status === 4) {
      return <div className="container">
              <div className="box">
                <h2> Error occurred :'( </h2>
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
                  Deposit, you can:
                </li>
                <li>
                  <ul>
                    <br />
                    <li>
                      Copy this address of smart-contract <b className="eth-address">{this.state.contractAddress}</b>
                      <br />
                      <br />
                      Go to your Ethereum wallet and paste the address of smart-contract as destination address
                    </li>  
                    <li>  
                      Scan QR code
                      <br />
                      <br />
                      <QRCode value={this.state.contractAddress} />
                      <br />
                      <br />
                    </li>
                    <li>
                      <button className="continue" href="" onClick={() => this.finish()}>Use MetaMask</button>
                    </li>
                  </ul>
                </li>
                <li>
                  Submit the money transfer
                </li>
              </ol>
            </div>
            <div className="row-padding">
              As soon as transaction is accomplished you can follow the details and statistics at <Link to={"/requests"} onClick={() => this.setPage("portfolios")}>Portfolio page</Link>
            </div>
            {/*<div className="row-padding">
              Time left <Timer start={this.state.request.contract_deployment} duration={1000 * 60 * 45} /> 
            </div>*/}
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
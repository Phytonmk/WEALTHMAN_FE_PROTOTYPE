import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { api, setPage, setCurrency, previousPage } from '../helpers';
import { abi as portfolio_abi } from '../smart-contract-data';

global.portfolio_abi = portfolio_abi;

class WithdrawPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contract_address: '',
      gotData: false
      // state: 0 // 1 - withdraw page, 2 - withdrawing process, 3 - withdrawed, 4 - error
    };
  }
  componentDidMount() {
    api.post('withdraw-address', {
      request: this.props.match.params.request
    }).then((res) => {
      if (res.data.mayBeWithdrawed)
        this.setState({
          contract_address: res.data.address,
          gotData: true
        })
      else
        this.setState({
          unableToWithdraw: true,
          gotData: true
        })
      // let state = 4;
      // if (res.data.alreadyWithdrawed)
      //   state = 3;
      // else if (res.data.withdrawingProcess)
      //   state = 2;
      // else if (res.data.mayBeWithdrawed)
      //   state = 1;
      // this.setState({contract_address: res.data.address || '', state});
    });
  }
  withdraw() {
    const contract = web3.eth.contract(portfolio_abi)
    console.log(this.state.contract_address);
    const myContractInstance = contract.at(this.state.contract_address);
    myContractInstance.withdraw(console.log);
  }
  sellTokens() {
    api.post('sell-tokens', {request: this.props.match.params.request})
      .then(() => setPage('requests'))
      .catch(console.log)
  }
  render() {
    // if (this.state.state === 0) 
    //   return <p>Loading..</p>
    // let page = '';
    // switch(this.state.state) {
    //   case 1:
    //     page = 
    //       <p>
    //         <Link to="/portfolios">
    //           <button className="back">Back</button>
    //         </Link>
    //         <button className="continue" onClick={() => this.withdraw()}>Widthdraw</button>
    //       </p>
    //   break;
    //   case 2:
    //     page = 
    //       <p>Withdrawing...</p>
    //   case 3:
    //     page =
    //       <div>
    //         <p>withdrawed</p>
    //         <Link to="/portfolios">
    //           <button className="back">Go back to portfolios</button>
    //         </Link>
    //       </div>
    //   break;
    //   case 4:
    //     page =
    //       <h3>
    //         Error occured
    //       </h3>
    //   break;
    // }
    if (!this.state.gotData) 
      return <p>Loading..</p>
    if (this.state.contract_address)
      return(
        <div>
          <div className="container">
            <div className="box">
              <h2>Withdrawing portfolio #{this.props.match.params.request}</h2>
                {this.state.contract_address !== '' ? <div className="row-padding">
                  <p>All portfolio currencies will be withdrawed from smart contract <b>{this.state.contract_address}</b> to address which was specified before deploying</p>
                </div> : ''}
                <div className="row-padding">
                  <button className="continue" onClick={() => this.withdraw()}>Widthdraw</button>
                </div>
            </div>
          </div>
        </div>
      );
  else
      return(
        <div>
          <div className="container">
            <div className="box">
              <h2>Withdrawing portfolio #{this.props.match.params.request}</h2>
                {this.state.contract_address !== '' ? <div className="row-padding">
                  <p>All portfolio currencies will be withdrawed from smart contract <b>{this.state.contract_address}</b> to address which was specified before deploying</p>
                </div> : ''}
                <div className="row-padding">
                  <button className="continue" onClick={() => this.sellTokens()}>Sell tokens</button>
                </div>
            </div>
          </div>
        </div>
      );
  }
}


export default connect(a => a)(WithdrawPage);
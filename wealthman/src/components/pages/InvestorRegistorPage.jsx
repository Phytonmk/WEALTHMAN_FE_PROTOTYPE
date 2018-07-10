import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import { api, getCookie, setPage } from '../helpers';

class InvestorRegistorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      age: '',
      phone_number: '',
      country: '',
      address: '',
      wallet_address: ''
    }
  }
  saveData() {
    api.post('investor/data', Object.assign({accessToken: getCookie('accessToken')}, this.state))
      .then(() => {setPage('account')})
      .catch(console.log);
  }
  render() {
    return (
      <div className="container">
          <div className="box">
            <h2>Personal information</h2> 
            <div className="row">
              First name
            </div>
            <div className="row">
               <input type="text" value={this.state.first_name} onChange={(event) => {this.setState({first_name: event.target.value})}} placeholder="First name" />
            </div> 
            <div className="row">
              Last name
            </div>
            <div className="row">
               <input type="text" value={this.state.last_name} onChange={(event) => {this.setState({last_name: event.target.value})}} placeholder="Last name" />
            </div> 
            <div className="row">
              Age
            </div>
            <div className="row">
               <input type="number" value={this.state.age} onChange={(event) => {this.setState({age: event.target.value})}} placeholder="Age" />
            </div> 
            <div className="row">
              Upload photo
            </div>
            <div className="row">
               <input type={"text" /*"file"*/} value="" />
            </div>
            <div className="row">
              Phone number
            </div>
            <div className="row">
               <input type="text" value={this.state.phone_number} onChange={(event) => {this.setState({phone_number: event.target.value})}} placeholder="Phone number" />
            </div> 
            <div className="row">
              Country
            </div>
            <div className="row">
               <input type="text" value={this.state.country} onChange={(event) => {this.setState({country: event.target.value})}} placeholder="Country" />
            </div> 
            <div className="row">
              Address
            </div>
            <div className="row">
               <input type="text" value={this.state.address} onChange={(event) => {this.setState({address: event.target.value})}} placeholder="Address" />
            </div> 
            <div className="row">
              Wallet address
            </div>
            <div className="row">
               <input type="text" value={this.state.wallet_address} onChange={(event) => {this.setState({wallet_address: event.target.value})}} placeholder="Wallet address" />
            </div> 
            <div className="row">
               In case you have not got Ethereum Wallet push the button below
            </div>
            <div className="row">
              <br />
              <button className="back">Create Ethereum Wallet</button>
            </div>
            <br />
            <br />
            <div className="row">
              <button className="continue" onClick={() => this.saveData()}>Save data</button>
            </div>
          </div>
      </div>
    );
  }
}

export default connect(a => a)(InvestorRegistorPage)
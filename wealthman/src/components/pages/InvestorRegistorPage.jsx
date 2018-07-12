import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import auth from '../auth.js';
import { api, getCookie, setPage } from '../helpers';

// const Eth = require('web3-eth');
let uploadFile;

class InvestorRegistorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      surname: '',
      age: '',
      phone_number: '',
      country: '',
      address: '',
      wallet_address: '',
      photo_uploaded: ''
    }
  }
  createWallet() {
    if (typeof web3 === 'undefined') {
      alert('Install Metamusk');
    } else {
      const provider = web3.currentProvider;
      web3.eth.personal.newAccount('pasword')
        .then(res => console.log(res));
      // const account = web3.eth.accounts.create();
      console.log(account);
    }
    // console.log(Eth);
    // const eth = new Eth(Eth.givenProvider);
    // console.log(eth);
  }
  uploadPhoto() {
    api.upload(this.state.register, uploadFile)
      .then((url) => {
        this.setState({photo_uploaded: url});
      })
      .catch(console.log)
  }
  saveData() {
    api.post('investor/data', Object.assign({accessToken: getCookie('accessToken')}, this.state))
      .then(() => {
        auth();
        setPage('account')
      })
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
               <input type="text" value={this.state.name} onChange={(event) => {this.setState({name: event.target.value})}} placeholder="First name" />
            </div> 
            <div className="row">
              Last name
            </div>
            <div className="row">
               <input type="text" value={this.state.surname} onChange={(event) => {this.setState({surname: event.target.value})}} placeholder="Last name" />
            </div> 
            <div className="row">
              Age
            </div>
            <div className="row">
               <input type="number" value={this.state.age} onChange={(event) => {this.setState({age: event.target.value})}} placeholder="Age" />
            </div> 
            <div className="row">
              {this.state.photo_uploaded === '' ? 'Upload photo' : 'Uploaded photo'}
            </div>
            {this.state.photo_uploaded === '' ?
              <div>
                <div className="row">
                  <input type="file" name="file" onChange={(event) => uploadFile = event.target.files[0]}/>
                  <br />
                  <button className="back" onClick={() => this.uploadPhoto()}>Upload</button>
                  <br />
                  <br />
                </div>
              </div> :
              <div className="row">
                <img src={this.state.photo_uploaded} />
              </div>
            }
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
              <button onClick={() => this.createWallet()} className="back">Create Ethereum Wallet</button>
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
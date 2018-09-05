import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import auth from '../auth.js';
import { api, getCookie, setPage } from '../helpers';

import Input from '../Input';

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
      photo_uploaded: '',
      generated_wallet: ''
    }
  }
  createWallet() {
    api.get('create-wallet')
      .then(res => {
        this.setState({
          wallet_address: res.data.address,
          generated_wallet: res.data.address,
          privateKey: res.data.privateKey
        })
      })
      .catch(console.log);
  }
  uploadPhoto() {
    api.upload('investor', uploadFile)
      .then((url) => {
        this.setState({photo_uploaded: url});
      })
      .catch(console.log)
  }
  saveData() {
    if (this.state.wallet_address === '')
      alert('Wallet address field is empty')
    else
      api.post('investor/data', Object.assign({accessToken: getCookie('accessToken')}, this.state))
        .then(() => {
          auth();
          if (this.props.currentManager === -1)
            setPage('account');
          else
            setPage('kyc');
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
               <Input value={this.state.name} setValue={value => {this.setState({name: value})}} placeholder="First name" />
            </div>
            <div className="row">
              Last name
            </div>
            <div className="row">
               <Input value={this.state.surname} setValue={value => {this.setState({surname: value})}} placeholder="Last name" />
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
                <img className="uploaded-photo" src={this.state.photo_uploaded} />
              </div>
            }
            <div className="row">
              Phone number
            </div>
            <div className="row">
               <Input value={this.state.phone_number} setValue={value => {this.setState({phone_number: value})}} placeholder="Phone number" />
            </div>
            <div className="row">
              Country
            </div>
            <div className="row">
               <Input value={this.state.country} setValue={value => {this.setState({country: value})}} placeholder="Country" />
            </div>
            <div className="row">
              Address
            </div>
            <div className="row">
               <Input value={this.state.address} setValue={value => {this.setState({address: value})}} placeholder="Address" />
            </div>
            <div className="row">
              Wallet address
            </div>
            <div className="row">
               <Input value={this.state.wallet_address} setValue={value => {this.setState({wallet_address: value})}} placeholder="Wallet address" />
            </div>
            <div className="row" style={this.state.privateKey && this.state.wallet_address === this.state.generated_wallet  ? {display: 'block'} : {display: 'none'}}>
              Your private key, save it to safe place
            </div>
            <div className="row" style={this.state.privateKey && this.state.wallet_address === this.state.generated_wallet ? {display: 'block'} : {display: 'none'}}>
               <Input value={this.state.privateKey}   />
               <br />
               <b>Notice</b>: Wealthman does not save your private keys in the datadase. Keep your private key in secret.
            </div>
            <div className="row" style={this.state.wallet_address !== '' ? {display: 'none'} : {display: 'block'}}>
               In case you have not got Ethereum Wallet push the button below
            </div>
            <div className="row" style={this.state.wallet_address !== '' ? {display: 'none'} : {display: 'block'}}>
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

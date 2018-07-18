import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import { api, getCookie, setPage } from '../helpers';

import auth from '../auth.js';

const servicesList = ['Robo-advisor', 'Discretionary', 'Advisory']

let uploadFile;
class ManagerDetailingPage extends Component {
  constructor(props) {
    super(props);
    const state = {register: '', photo_uploaded: '', privateKey: '', wallet_address: ''};
    for (let q of questions.manager)
      state[q] = ''
    for (let q of questions.company)
      state[q] = ''
    state.services = [];
    this.state = state;
  }
  addService() {
    const services = [...this.state.services];
    let type = services.length;
    services.push({type: 0, fee: 0, recalculation: 365});
    this.setState({services});
  }
  removeService(index) {
    const services = [...this.state.services];
    services.splice(index, 1);
    this.setState({services});
    this.forceUpdate();
  }
  setServiceData(event, serviceIndex, property) {
    const services = [...this.state.services];
    services[serviceIndex][property] = event.target.value * 1;
    this.setState({services});
    console.log(this.state.services);
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
    api.upload(this.state.register, uploadFile)
      .then((url) => {
        this.setState({photo_uploaded: url});
      })
      .catch(console.log)
  }
  saveData() {
    if (this.state.wallet_address === '' && this.state.register === 'manager')
      alert('Wallet address field is empty')
    else
      api.post(this.state.register + '/data', Object.assign({accessToken: getCookie('accessToken')}, this.state))
        .then(() => {setPage('requests'); auth()})
        .catch(console.log);
  }
  render() {
    return (
      <div className="container">
          <div className="box">
            <h2>{this.state.register === '' ? 'What you are going to register?' : `To complete registration of ${this.state.register} submit form`}</h2> 
            { 
              this.state.register === ''
              ?
              <div>
                <div className="row">
                  <button className="continue" onClick={() => this.setState({register: 'manager'})}>Registration of manager</button>  
                </div>
                <br />
                <div className="row">
                  <button className="continue" onClick={() => this.setState({register: 'company'})}>Registration of company</button>  
                </div>
                <br />
              </div>
              :
              <div> 
                {questions[this.state.register].map((question, i) => <div key={i}>
                  <div className="row capitalize">
                    {question.replace(/\_/g, ' ')}
                  </div>
                  <div className="row">
                    <input type="text" value={this.state[question]} onChange={(event) => {this.setState({[question]: event.target.value})}} placeholder={question.replace(/\_/g, ' ')} />
                  </div> 
                </div>)}
                <br />
                <div className="row">
                  Services
                </div>
                <br />
                {this.state.services.map((service, i) => <div key={i} className="service-selecting-element">
                  <select onChange={(event) => this.setServiceData(event, i, 'type')}>
                    {servicesList.map((option, index) => <option {...service.type === index ? 'selected' : 's'} key={index} value={index}>{option}</option>)}
                  </select>
                  <br />
                  Fee
                  <br />
                  <input type="number" placeholder="fee" value={service.fee} onChange={(event) => this.setServiceData(event, i, 'fee')}/>
                  <br />
                  Recalculation
                  <br />
                  <input type="number" placeholder="recalculation" value={service.recalculation} onChange={(event) => this.setServiceData(event, i, 'recalculation')}/>
                  <br />
                  <button className="back" onClick={() => this.removeService(i)}>Remove {servicesList[service.type]} from list</button>
                  <br />
                  <br />
                </div>)}
                {this.state.services.length < 3 ? <div className="row">
                  <button className="back" onClick={() => this.addService()}>Add service</button>
                </div> : ''}
                <br />
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
                {this.state.register === 'manager' ?
                <div>
                
                  <div className="row">
                    Wallet address
                  </div>
                  <div className="row">
                     <input type="text" value={this.state.wallet_address} onChange={(event) => {this.setState({wallet_address: event.target.value})}} placeholder="Wallet address" />
                  </div>
                  <div className="row" style={this.state.privateKey && this.state.wallet_address === this.state.generated_wallet  ? {display: 'block'} : {display: 'none'}}>
                    Your private key, save it to safe place
                  </div> 
                  <div className="row" style={this.state.privateKey && this.state.wallet_address === this.state.generated_wallet  ? {display: 'block'} : {display: 'none'}}>
                     <input type="text" value={this.state.privateKey}   />
                  </div> 
                  <div className="row" style={this.state.wallet_address !== '' ? {display: 'none'} : {display: 'block'}}>
                     In case you have not got Ethereum Wallet push the button below
                  </div>
                  <div className="row" style={this.state.wallet_address !== '' ? {display: 'none'} : {display: 'block'}}>
                    <br />
                    <button onClick={() => this.createWallet()} className="back">Create Ethereum Wallet</button>
                    <br />
                    <br />
                  </div> 
                </div>: ''
                }
                <div className="row">
                  <button className="back" onClick={() => this.setState({register: ''})}>Back</button>
                  <button className="continue" onClick={() => this.saveData()}>Save data</button>
                </div>
              </div>
            }
            <br />
          </div>
      </div>
    );
  }
}

export default connect(a => a)(ManagerDetailingPage)

const questions = {
  manager: [
    'name',
    'surname',
    'company_name',
    'company_link',
    'methodology',
    'exit_fee',
    'managment_fee',
    'font_fee',
    'performance_fee',
    'tweeter',
    'fb',
    'linkedin',
    'about'
  ],
  company: [
    'company_name',
    'company_link',
    'founded',
    'company_size',
    'headqueartet',
    'methodology',
    'fees',
    'tweeter',
    'fb',
    'linkedin',
    'about',
  ]
}
/*
check personal/company
personal:
team:
name 
surname
tweeter
fb
linkedin
offers
methodology
exit_fee
managment_fee
font_fee
performance_fee
min_investment

*/
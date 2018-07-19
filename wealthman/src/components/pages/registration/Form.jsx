import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { api, setPage, setCurrency } from '../../helpers';

const servicesList = ['Robo-advisor', 'Discretionary', 'Advisory'];

class Form extends Component {
  constructor(props) {
    super(props);
    const state = {};
    props.questions.forEach((question) => {
      switch (question.type) {
        case 'photo_upload':
          state[question.property] = {
            photo_uploaded: question.photo_url ? true : false,
            photo_url: question.photo_url || '',
            file: null
          }
        break;
        case 'wallet_address':
          state[question.property] = {
            wallet_address: question.value ? question.value : '',
            generated_wallet: '',
            private_key: ''
          }
        break;
        case 'services':
          state[question.property] = {
            services: question.services || [],
          }
        break;
        default:
          state[question.property] = question.value || ''
      }
    });
    this.state = state;
  }
  createWallet(property) {
    api.get('create-wallet')
      .then(res => {
        const state = Object.assign({}, this.state);
        state[property].wallet_address = res.data.address;
        state[property].generated_wallet = res.data.address;
        state[property].privateKey = res.data.privateKey;
        this.setState(state);
      })
      .catch(console.log);
  }
  uploadPhoto(property, uploadFor, uploadFile) {
      api.upload(uploadFor, uploadFile)
        .then((url) => {
          const state = Object.assign({}, this.state);
          state[property].photo_uploaded = true;
          state[property].photo_url = url;
          this.setState(state);
        })
        .catch((err) => {
          console.log(err);
        })
  }
  change(property, value) {
    const state = Object.assign({}, this.state);
    state[property] = value;
    this.setState(state);
  }
  changeWalletAddress(property, value) {
    const state = Object.assign({}, this.state);
    state[property].wallet_address = value;
    this.setState(state);
  }
  addService(property) {
    const state = Object.assign({}, this.state);
    let type = this.state[property].services.length;
    if (type < 3)
      this.state[property].services.push({
        type,
        exit_fee: 12,
        managment_fee: 12,
        perfomance_fee: 12,
        font_fee: 12,
        recalculation: 365,
        min: '',
        metodology: '',
        philosofy: '',
      });
    this.setState(state);
  }
  removeService(property, index) {
    const state = Object.assign({}, this.state);
    state[property].services.splice(index, 1);
    this.setState(state);
  }
  setServiceData(property, event, serviceIndex, serviceProperty) {
    const state = Object.assign({}, this.state);
    console.log(property);
    state[property].services[serviceIndex][serviceProperty] = event.target.value;
    this.setState(state);
    console.log(this.state[property]);
    this.forceUpdate();
  }
  submit() {
    const data = {};
    let ok = true;
    for (let question of this.props.questions) {
      switch(question.type) {
        case 'photo_upload':
          data[question.property] = this.state[question.property].photo_url;
          if (question.obvious && !this.state[question.property].photo_uploaded)
            ok = false;
          break;
        case 'wallet_address':
          data[question.property] = this.state[question.property].wallet_address;
          if (question.obvious && this.state[question.property].wallet_address === '')
            ok = false;
          break;
        case 'services':
          data[question.property] = this.state[question.property].services;
          if (question.obvious && this.state[question.property].services.length === 0)
            ok = false;
          break;
        default:
          data[question.property] = this.state[question.property];
          if (question.obvious && this.state[question.property] === '')
            ok = false;
      }
      if (!ok) {
        alert(`Field ${question.title} must be filled!`);
        break;
      }
    }
    if (ok)
      this.props.onSubmit(data);
  }
  render() {
    return (
      <div>
        {this.props.questions.map((question, i) => {
          let input;
          switch(question.type) {
            case 'photo_upload':
              input = 
                <div>
                  <div className="row">
                    {!this.state[question.property].photo_uploaded ? 'Upload photo' : 'Uploaded photo'}
                  </div>
                  {this.state[question.property].photo_uploaded ?
                    <div className="row">
                      <img className="uploaded-photo" src={this.state[question.property].photo_url ? api.imgUrl(this.state[question.property].photo_url) : ''} />
                    </div> : ''}
                  <div>
                    <div className="row">
                      <input type="file" name="file" onChange={(event) => this.state[question.property].file = event.target.files[0]}/>
                      <br />
                      <button className="back" onClick={() => this.uploadPhoto(question.property, question.uploadFor, this.state[question.property].file)}>{this.state[question.property].photo_uploaded ? 'Upload new' : 'Upload'}</button>
                      <br />
                      <br />
                    </div>
                  </div>
                </div>
            break;
            case 'wallet_address':
              input = 
                <div>
                  <div className="row">
                     <input type="text" value={this.state[question.property].wallet_address} onChange={(event) => this.changeWalletAddress(question.property, event.target.value)} placeholder={question.placeholder !== undefined ? question.placeholder : 'Wallet address'} />
                  </div>
                  <div className="row" style={this.state[question.property].privateKey && this.state[question.property].wallet_address === this.state[question.property].generated_wallet  ? {display: 'block'} : {display: 'none'}}>
                    Your private key, save it to safe place
                  </div> 
                  <div className="row" style={this.state[question.property].privateKey && this.state[question.property].wallet_address === this.state[question.property].generated_wallet ? {display: 'block'} : {display: 'none'}}>
                     <input type="text" value={this.state[question.property].privateKey}   />
                     <br />
                     <b>Notice</b>: Wealthman does not save your private keys in the datadase. Keep your private key in secret.
                  </div> 
                  <div className="row" style={this.state[question.property].wallet_address !== '' ? {display: 'none'} : {display: 'block'}}>
                     In case you have not got Ethereum Wallet push the button below
                  </div>
                  <div className="row" style={this.state[question.property].wallet_address !== '' ? {display: 'none'} : {display: 'block'}}>
                    <br />
                    <button onClick={() => this.createWallet(question.property)} className="back">Create Ethereum Wallet</button>
                  </div>
                </div>
            break;
            case 'services':
              input = <div className="services-block">
                {(this.state[question.property] || {services: []}).services.map((service, i) => <div key={i} className="service-selecting-element">
                  <select onChange={(event) => this.setServiceData(question.property, event, i, 'type')}>
                    {servicesList.map((option, index) => <option {...service.type === index ? 'selected' : 's'} key={index} value={index}>{option}</option>)}
                  </select>
                  <br />
                  Exit fee
                  <br />
                  <input type="number" placeholder="Exit fee" value={service.exit_fee} onChange={(event) => this.setServiceData(question.property, event, i, 'exit_fee')}/>
                  <br />
                  Managment fee
                  <br />
                  <input type="number" placeholder="Managment fee" value={service.managment_fee} onChange={(event) => this.setServiceData(question.property, event, i, 'managment_fee')}/>
                  <br />
                  Perfomance fee
                  <br />
                  <input type="number" placeholder="Perfomance fee" value={service.perfomance_fee} onChange={(event) => this.setServiceData(question.property, event, i, 'perfomance_fee')}/>
                  <br />
                  Font fee
                  <br />
                  <input type="number" placeholder="Font fee" value={service.font_fee} onChange={(event) => this.setServiceData(question.property, event, i, 'font_fee')}/>
                  <br />
                  Recalculation
                  <br />
                  <input type="number" placeholder="recalculation" value={service.recalculation} onChange={(event) => this.setServiceData(question.property, event, i, 'recalculation')}/>
                  <br />
                  Minimal investment
                  <br />
                  <input type="number" placeholder="Minimal investment" value={service.min} onChange={(event) => this.setServiceData(question.property, event, i, 'min')}/>
                  <br />
                  Metodology
                  <br />
                  <input type="text" placeholder="Metodology" value={service.metodology} onChange={(event) => this.setServiceData(question.property, event, i, 'metodology')}/>
                  <br />
                  Philosofy 
                  <br />
                  <input type="text" placeholder="Philosofy" value={service.philosofy} onChange={(event) => this.setServiceData(question.property, event, i, 'philosofy')}/>
                  <br />
                  <button className="back" onClick={() => this.removeService(question.property, i)}>Remove {servicesList[service.type]} from list</button>
                  <br />
                  <br />
                </div>)}
                {(this.state[question.property] || {services: []}).services.length < 3 ? <div className="row">
                  <button className="back" onClick={() => this.addService(question.property)}>Add service</button>
                </div> : ''}
              </div>
            break;
            default:
              input = 
                <input
                  type={question.type === 'number' ? 'number' : 'text'}
                  placeholder={question.placeholder ? question.placeholder : question.title}
                  value={this.state[question.property]}
                  onChange={(event) => this.change(question.property, event.target.value)}
                />
            break;
           }
           return <div key={i} className="row">
              <p>{question.title}</p>
              {input}
            </div>
          })}
        <div className="row-padding">
          <button className="continue" onClick={() => this.submit()}>Submit</button>
        </div>
      </div>
    );
  }
}
export default connect(a => a)(Form);
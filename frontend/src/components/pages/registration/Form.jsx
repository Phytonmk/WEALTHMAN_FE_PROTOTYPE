import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { api, setPage, setCurrency } from '../../helpers';
import Avatar from '../../Avatar'
const servicesList = ['Robo-advisor', 'Discretionary', 'Advisory'];
import Input from '../../inputs/Input'

class Form extends Component {
  constructor(props) {
    super(props);
    const state = {};
    props.questions.forEach((question) => {
      switch (question.type) {
        case 'photo_uploaded':
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
        front_fee: 12,
        recalculation: 365,
        min: 10000000,
        methodology: '',
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
    state[property].services[serviceIndex][serviceProperty] = event.target.value;
    this.setState(state);
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
                      <br />
                      <Avatar size="150px" src={this.state[question.property].photo_url ? api.imgUrl(this.state[question.property].photo_url) : ''} />
                      <br />
                    </div> : ''}
                  <div>
                    <div className="row">
                      <input className="file-upload" type="file" name="file" onChange={(event) => this.state[question.property].file = event.target.files[0]}/>
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
                     <Input type="text" value={this.state[question.property].wallet_address} setValue={(value) => this.changeWalletAddress(question.property, value)} placeholder={question.placeholder !== undefined ? question.placeholder : 'Wallet address'} />
                  </div>
                  <div className="row" style={this.state[question.property].privateKey && this.state[question.property].wallet_address === this.state[question.property].generated_wallet  ? {display: 'block'} : {display: 'none'}}>
                    Your private key, save it to safe place
                  </div>
                  <div className="row" style={this.state[question.property].privateKey && this.state[question.property].wallet_address === this.state[question.property].generated_wallet ? {display: 'block'} : {display: 'none'}}>
                     <Input type="text" value={this.state[question.property].privateKey} />
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
                    {servicesList.map((option, index) => <option {...service.type === index ? 'selected' : 's'} value={index}>{option}</option>)}
                  </select>
                  <br />
                  <br />
                  Exit fee
                  <br />
                  <Input type="number" placeholder="Exit fee" value={service.exit_fee} onChange={(event) => this.setServiceData(question.property, event, i, 'exit_fee')}/>
                  <br />
                  Managment fee
                  <br />
                  <Input type="number" placeholder="Managment fee" value={service.managment_fee} onChange={(event) => this.setServiceData(question.property, event, i, 'managment_fee')}/>
                  <br />
                  Perfomance fee
                  <br />
                  <Input type="number" placeholder="Perfomance fee" value={service.perfomance_fee} onChange={(event) => this.setServiceData(question.property, event, i, 'perfomance_fee')}/>
                  <br />
                  Font fee
                  <br />
                  <Input type="number" placeholder="Font fee" value={service.front_fee} onChange={(event) => this.setServiceData(question.property, event, i, 'front_fee')}/>
                  <br />
                  Recalculation
                  <br />
                  <Input type="number" placeholder="recalculation" value={service.recalculation} onChange={(event) => this.setServiceData(question.property, event, i, 'recalculation')}/>
                  <br />
                  Minimum investment
                  <br />
                  <Input type="number" placeholder="Minimum investment" value={service.min} onChange={(event) => this.setServiceData(question.property, event, i, 'min')}/>
                  <br />
                  Methodology
                  <br />
                  <Input type="text" placeholder="Methodology" value={service.methodology} onChange={(event) => this.setServiceData(question.property, event, i, 'methodology')}/>
                  <br />
                  Investment philosophy
                  <br />
                  <Input type="text" placeholder="Investment philosophy" value={service.philosofy} onChange={(event) => this.setServiceData(question.property, event, i, 'philosofy')}/>
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
                <Input
                  type={question.type === 'number' ? 'number' : 'text'}
                  placeholder={question.placeholder ? question.placeholder : question.title}
                  value={this.state[question.property]}
                  setValue={(value) => this.change(question.property, value)}
                />
            break;
           }
           return <div key={i} className="row">
              <small>{question.title}</small>
              {input}
            </div>
          })}
        <div className="row-padding">
          <button className="big-blue-button" onClick={() => this.submit()}>Submit</button>
        </div>
      </div>
    );
  }
}
export default connect(a => a)(Form);

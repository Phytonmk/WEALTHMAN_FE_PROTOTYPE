import React, { Component } from 'react';

import { api, getCookie } from '../../helpers'
import { store } from '../../../redux'

import Input from '../../Input';

class AccountInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPassword: '',
      newPassword: '',
      repeatNewPassword: '',
      newEmail: '',
      oldEmail: ''
    }
  }
  changePassword() {
    if (this.state.currentPassword !== '' && this.state.newPassword !== '' &&
      this.state.newPassword === this.state.repeatNewPassword) {
      api.post('changepassword', {
        old_password: this.state.currentPassword,
        new_password1: this.state.newPassword,
        new_password2: this.state.repeatNewPassword,
      })
      .then(() => this.setState({currentPassword: '', newPassword: '', repeatNewPassword: ''}))
      .catch((e) => {this.setState({wrongCurrentPassword: true}); console.log(e)});
    } else {
      if (this.state.currentPassword === '')
        this.setState({wrongCurrentPassword: true})
      if (this.state.newPassword === '' || this.state.newPassword !== this.state.repeatNewPassword)
        this.setState({wrongPasswordRepeat: true})
    }
    //
  }
  changeEmail() {
    const callback = () => {
      this.setState({newEmail: ''})
    }
    const errorHandler = (e) => {
      this.setState({emailChangeError: true})
      console.log(e)
    }
    api.post('change-email', {email: this.state.newEmail})
      .then(callback).catch(errorHandler)
  }
  genWallet() {
    if (web3 === undefined) {
      this.setState({noMetamask: true})
    } else {
      // console.log(web3.eth)
    }
  }
  componentDidMount() {
    api.get('my-email')
      .then((res) => this.setState({oldEmail: res.data}))
      .catch(console.log)
  }
  render() {
    return (
      <div>
        <div className="account-box">
          <small className="blue">a) CHANGE PASSWORD</small>
          <small>CURRENT PASSWORD</small>
          <Input
            error={this.state.wrongCurrentPassword}
            value={this.state.currentPassword}
            type="password"
            setValue={value => this.setState({currentPassword: value, wrongCurrentPassword: false})}
            placeholder="Enter your current password"
          />
          <small>NEW PASSWORD</small>
          <Input
            error={this.state.wrongPasswordRepeat}
            value={this.state.newPassword}
            type="password"
            setValue={value => this.setState({newPassword: value, wrongPasswordRepeat: false})}
            placeholder="Enter password"
          />
          <small>REPEAT NEW PASSWORD</small>
          <Input
            error={this.state.wrongPasswordRepeat}
            value={this.state.repeatNewPassword}
            type="password"
            setValue={value => this.setState({repeatNewPassword: value, wrongPasswordRepeat: false})}
            placeholder="Enter password"
          />
          <button onClick={() => this.changePassword()} className="big-blue-button save">
            Change password
          </button>
        </div>
        <div className="account-box">
          <small className="blue">b) Change email</small>
          <small>NEW EMAIL</small>
          <Input
            error={this.state.emailChangeError}
            value={this.state.newEmail}
            setValue={value => this.setState({newEmail: value, emailChangeError: false})}
            placeholder="user@example.com"
          />
          {this.state.newEmail !== '' ? <small>Firstly you will recive confirmation link on your old email address <b>{this.state.oldEmail}</b>, after that confirmation link will be send to your new email address</small> : ''}
          <button onClick={() => this.changeEmail()} className="big-blue-button save">
            Change email
          </button>
        </div>
        <div className="account-box">
          <small className="blue">c) Generate Ethereum wallet</small>
          <small>CURRENT WALLET ADDRESS</small>
          <Input
            value={this.state.currentWallet}
            setValue={value => this.setState({currentWallet: value})}
            placeholder="No wallet, enter it or generate new by tap the button below"
          />
          {this.state.noMetamask ? <small className="error">You have to install Metamask and be logged in to generate wallet</small> : ''}
          <button onClick={() => this.genWallet()} className="big-blue-button">
            Generate Ethereum wallet in your browser
          </button>
          <button onClick={() => this.saveWalet()} className="big-blue-button save margin-left">
            Save wallet
          </button>
        </div>
        {store.getState().user !== 0 ? '' :
          <React.Fragment>
            <div className="account-box">
              <small className="blue">d) Privacy and Security</small>
              <label><Input type="switcher" value={true}/> <small>Allow managers that provide you service or managers you contact to see when you were last active on Wealthman apps</small></label>
            </div>
            <div className="account-box">
              <small className="blue">e) Marketplace access</small>
              <label><Input type="switcher" value={true}/> <small>Enable Wealthman Marketplace access</small></label>
            </div>
          </React.Fragment>
        }
      </div>
    );
  }
}

export default AccountInfo;

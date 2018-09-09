import React, { Component } from 'react';

import { api } from '../../helpers'

import Input from '../../inputs/Input';

class AccountInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      phone: "",
      currentPassword: "",
      newPassword: "",
      repeatNewPassword: "",
    }
  }
  saveData() {
    api.post('personal-data/save', this.state)
      .then(() => {alert('Saved')})
      .catch(console.log);
  }
  changePassword() {
    if (this.state.currentPassword !== '' && this.state.newPassword !== '' &&
      this.state.newPassword === this.state.repeatNewPassword) {
      api.post('changepassword', {
        old_password: this.state.currentPassword,
        new_password1: this.state.newPassword,
        new_password2: this.state.repeatNewPassword,
      })
      .then(() => alert('Password changed'))
      .catch(console.log);
    }
  }
  componentDidMount() {
    api.post('personal-data/load')
      .then((res) => {
        const data = res.data.personalData
        delete data._id
        delete data._v
        this.setState(data)
      })
      .catch(console.log)
  }
  render() {
    return (
      <div>
        <div className="account-box">
          <small className="blue">1. CONTACT INFORMATION</small>
          <small>YOUR EMAIL</small>
          <Input
            value={this.state.email}
            setValue={value => this.setState({email: value})}
            placeholder="username@email.com"
          />
          <small>PHONE NUMBER</small>
          <Input
            value={this.state.phone}
            setValue={value => this.setState({phone: value})}
            placeholder="+7 (___) ___ - __ - __"
          />
          <button onClick={() => this.saveData()} className="big-blue-button save">
            Save changes
          </button>
        </div>
        <div className="account-box last">
          <small className="blue">2. CHANGE PASSWORD</small>
          <small>CURRENT PASSWORD</small>
          <Input
            value={this.state.currentPassword}
            setValue={value => this.setState({currentPassword: value})}
            placeholder="Enter your current password"
          />
          <small>NEW PASSWORD</small>
          <Input
            value={this.state.newPassword}
            setValue={value => this.setState({newPassword: value})}
            placeholder="Enter password"
          />
          <small>REPEAT NEW PASSWORD</small>
          <Input
            value={this.state.repeatNewPassword}
            setValue={value => this.setState({repeatNewPassword: value})}
            placeholder="Enter password"
          />
          <button onClick={() => this.changePassword()} className="big-blue-button save">
            Change password
          </button>
        </div>
      </div>
    );
  }
}

export default AccountInfo;

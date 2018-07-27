import React, { Component } from 'react';

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

  render() {
    return (
      <div>
        <div className="account-box">
          <small className="blue">1. CONTACT INFORMATION</small>
          <small>YOUR EMAIL</small>
          <input
            value={this.state.email}
            onChange={event => this.setState({email: event.target.value})}
            placeholder="username@email.com"
          />
          <small>PHONE NUMBER</small>
          <input
            value={this.state.phone}
            onChange={event => this.setState({phone: event.target.value})}
            placeholder="+7 (___) ___ - __ - __"
          />
        </div>
        <div className="account-box last">
          <small className="blue">2. CHANGE PASSWORD</small>
          <small>CURRENT PASSWORD</small>
          <input
            value={this.state.currentPassword}
            onChange={event => this.setState({currentPassword: event.target.value})}
            placeholder="Enter your current password"
          />
          <small>NEW PASSWORD</small>
          <input
            value={this.state.newPassword}
            onChange={event => this.setState({newPassword: event.target.value})}
            placeholder="Enter password"
          />
          <small>REPEAT NEW PASSWORD</small>
          <input
            value={this.state.repeatNewPassword}
            onChange={event => this.setState({repeatNewPassword: event.target.value})}
            placeholder="Enter password"
          />
          <button className="big-blue-button save">
            Save changes
          </button>
        </div>
      </div>
    );
  }
}

export default AccountInfo;

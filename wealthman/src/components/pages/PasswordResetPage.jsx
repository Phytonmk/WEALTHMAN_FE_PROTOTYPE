import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import auth from '../auth';
import { api, setPage, setCookie, setCurrency, previousPage, niceNumber } from '../helpers';
import LevDate from '../LevDate'
import Input from '../Input'

const findGetParameter = (parameterName) => {
    let result = null,
      tmp = []
    location.href
      .substr(location.href.indexOf('?'))
      .substr(1)
      .split('&')
      .forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === parameterName)
          result = tmp[1]
          // result = decodeURIComponent(tmp[1])
      })
    return result
}

class PasswordResetPage extends Component {
  constructor(props) {
    super(props)
    console.log(location)
    this.state = {
      email: findGetParameter('email') === null ? '' : findGetParameter('email'),
      code: findGetParameter('code') === null ? '' : findGetParameter('code'),
      password: '',
      passwordRepeat: '',
      passwordError: false,
      unknownError: false,
    }
  }
  resetPassword() {
    if (this.state.password === '' || this.state.password !== this.state.passwordRepeat)
      this.setState({passwordError: true})
    else
      api.post('password-reset', {
        email: this.state.email,
        code: this.state.code,
        password: this.state.password,
      })
      .then((res) => {
        setCookie('accessToken', res.data.accessToken)
        setCookie('usertype', res.data.usertype)
        auth()
        setPage('account')
      })
      .catch((e) => {
        console.log(e)
        this.setState({unknownError: true})
      })
  }
  render() {
    return <div className="container">
      <div className="account-box">
        <div className="row-padding">
          <small className="blue">Your email address</small>
          <Input error={this.state.unknownError} value={this.state.email} setValue={email => this.setState({email, unknownError: false})} placeholder="user@example.com" />
        </div>
        <div className="row-padding">
          <small className="blue">Password reset code</small>
          <Input error={this.state.unknownError} value={this.state.code} setValue={code => this.setState({code, unknownError: false})} placeholder="xxx-xxx-xxx" />
        </div>
        <div className="row-padding">
          <small className="blue">New Password</small>
          <Input error={this.state.passwordError} value={this.state.password} setValue={password => this.setState({password, passwordError: false})} placeholder="****" type="password" />
        </div>
        <div className="row-padding">
          <small className="blue">Repeat new password</small>
          <Input error={this.state.passwordError} value={this.state.passwordRepeat} setValue={passwordRepeat => this.setState({passwordRepeat, passwordError: false})} placeholder="****" type="password" />
        </div>
        <div className="row">
          <button className="big-blue-button" onClick={() => this.resetPassword()}>Reset Password</button>
        </div>
      </div>
    </div>
  }
}


export default PasswordResetPage

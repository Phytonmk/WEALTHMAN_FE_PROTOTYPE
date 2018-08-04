import React, { Component } from 'react'
import { setReduxState } from '../redux/index'
import { Link } from 'react-router-dom'

import { api, setCookie, getCookie } from './helpers'
import auth from './auth'

import Input from './Input'

import '../css/AuthWindows.sass'

export default class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      login: '',
      password: '',
      wrongPassword: false
    }
  }
  hide(event, forced=false) {
    if (forced || event.target.classList.contains('close-modal-btn') ||
          event.target.classList.contains('modal-wrapper'))
      this.props.hide()
  }
  login() {
    api.post('login', {
      login: this.state.login,
      password: this.state.password,
    })
      .then((res) => {
        setCookie('accessToken', res.data.accessToken)
        setCookie('usertype', res.data.usertype)
        auth(() => {
          this.setState({login: '', password: ''})
          this.hide(null, true)
          if (typeof this.props.callback === 'function')
            this.props.callback()
        })
      })
      .catch((e) => {
        console.log(e)
        if (e.response && e.response.status === 403) {
          this.setState({wrongPassword: true})
        }
      })
  }
  render() {
    return (
      <div onClick={(event) => this.hide(event)} className={this.props.visible ? 'modal-wrapper visible' : 'modal-wrapper'}>
        <div className="auth-box">
          <div className="close-modal-btn">
          </div>
          <h2>Sign in to WealthMan.</h2>
          <span>Enter your details below.</span>
          <div className="row first-input-row">
            <label>Email address</label>
            {/* <input style={this.state.wrongPassword ? {borderColor: 'red'} : {}} type="text" value={this.state.login} onChange={(event) => this.setState({login: event.target.value, wrongPassword: false})} placeholder="username@example.com" /> */}
            <Input value={this.state.login} setValue={value => this.setState({login: value, wrongPassword: false})} placeholder="username@example.com" />
          </div>
          <div className="row">
            <label>Password</label>
            <Link to={'#'} className="forgot-password-link">
              Forgot password?
            </Link>
            {/* <input style={this.state.wrongPassword ? {borderColor: 'red'} : {}} type="password" value={this.state.password} onChange={(event) => this.setState({password: event.target.value, wrongPassword: false})} placeholder="Enter your password" /> */}
            <Input type="password" value={this.state.password} setValue={value => this.setState({password: value, wrongPassword: false})} placeholder="Enter your password" />
          </div>
          <div className="row submit-row">
            <button className="big-blue-button auth-btn" onClick={() => this.login()}>Sign in</button>
            <div>
              <Link to="supported-browsers" target="_blank">Supported browsers</Link>
            </div>
          </div>
          <div className="devider"></div>
          <div className="row footer-row">
            <span>Don’t have an account?</span>
            <a onClick={() => this.props.openSignIn()} className="another-auth-window-link">Register now</a>
          </div>
        </div>
      </div>
    )
  }
}

import React, { Component } from 'react'
import { setReduxState } from '../redux/index'
import { Link } from 'react-router-dom'

import { setPage, api, setCookie, getCookie } from './helpers'
import auth from './auth'
import GoogleLogin from 'react-google-login'
import FacebookLogin from 'react-facebook-login'

import Input from './inputs/Input'

import '../css/AuthWindows.sass'

export default class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      login: '',
      password: '',
      wrongPassword: false,
      wasFacebookClick: false,
      passwordReset: false,
      resetEmail: ''
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
          else
            setPage('dashboard')
        })
      })
      .catch((e) => {
        console.log(e)
        if (e.response && e.response.status === 403) {
          this.setState({wrongPassword: true})
          setTimeout(() => {
            this.setState({wrongPassword: false})
          }, 2500)
        }
      })
  }
  oauth(service, authData) {
    if (service === 'facebook' && !this.state.wasFacebookClick)
      return
    api.post('oauth/' + service, {
      token: authData.accessToken
    })
    .then((res) => {
      if (res.data.dataFilled) {
        setCookie('accessToken', res.data.token)
        setCookie('usertype', res.data.usertype)
        auth(() => {
          this.setState({login: '', password: ''})
          this.hide(null, true)
          if (typeof this.props.callback === 'function')
            this.props.callback()
          else
            setPage('dashboard')
        })
      } else {
        this.props.openSignIn()
      }
    })
    .catch(console.log);
  }
  reset() {
    api.post('forgot-password', {email: this.state.resetEmail})
      .then(res => {
        this.setState({
          resetEmail: '',
          passwordReset: false,
          passwordResetError: false
        })
        this.props.hide()
      })
      .catch((e) => {
        console.log(e)
        this.setState({passwordResetError: true})
      })
  }
  render() {
    if (this.state.passwordReset)
      return (
      <div onClick={(event) => this.hide(event)} className={this.props.visible ? 'modal-wrapper visible' : 'modal-wrapper'}>
        <div className="auth-box">
          <div className="close-modal-btn">
          </div>
          <h2>Password reset</h2>
          <div className="row first-input-row">
            <label>Email address</label>
            <Input tabindex="0" error={this.state.passwordResetError} value={this.state.resetEmail} setValue={value => this.setState({resetEmail: value, passwordResetError: false})} placeholder="username@example.com" />
          </div>
          <div className="row submit-row">
            <button className="big-blue-button auth-btn" onClick={() => this.reset()}>Reset</button>
          </div>
          <div className="devider"></div>
          <div className="row footer-row">
            <span>Remembered password?</span>
            <a onClick={() => this.setState({passwordReset: false})} className="another-auth-window-link">Sign in now</a>
          </div>
        </div>
      </div>)
    return (
      <div onClick={(event) => this.hide(event)} className={this.props.visible ? 'modal-wrapper visible' : 'modal-wrapper'}>
        <div className="auth-box">
          <div className="close-modal-btn">
          </div>
          <h2>Sign in to Wealthman.</h2>
          <div className="row first-input-row">
            <label>Email address</label>
            {/* <input style={this.state.wrongPassword ? {borderColor: 'red'} : {}} type="text" value={this.state.login} onChange={(event) => this.setState({login: event.target.value, wrongPassword: false})} placeholder="username@example.com" /> */}
            <Input tabindex="0" error={this.state.wrongPassword} value={this.state.login} setValue={value => this.setState({login: value, wrongPassword: false})} placeholder="username@example.com" />
          </div>
          <div className="row">
            <label>Password</label>
            <Link to={'#'} onClick={() => this.setState({passwordReset: true})} className="forgot-password-link">
              Forgot password?
            </Link>
            {/* <input style={this.state.wrongPassword ? {borderColor: 'red'} : {}} type="password" value={this.state.password} onChange={(event) => this.setState({password: event.target.value, wrongPassword: false})} placeholder="Enter your password" /> */}
            <Input tabindex="1" error={this.state.wrongPassword} type="password" value={this.state.password} setValue={value => this.setState({password: value, wrongPassword: false})} placeholder="Enter your password" />
          </div>
          <div className="row submit-row">
            <button className="big-blue-button auth-btn" onClick={() => this.login()}>Sign in</button>
          </div>
          <div className="row oauth-container">
            <GoogleLogin
                clientId={this.props.googleClientId}
                buttonText="Sign in via Google"
                onSuccess={(authData) => this.oauth('google', authData)}
                onFailure={(e) => {console.log(e); alert('Unable to sign up via Google')}}
              />
              <FacebookLogin
                appId={this.props.facebookAppId}
                autoLoad={true}
                fields="email"
                onClick={() => this.setState({wasFacebookClick: true})}
                callback={(authData) => this.oauth('facebook', authData)}
                textButton="Sign in via Facebook"
              />
          </div>
          <div className="row submit-row">
            <div className="supported-browsers">
              <Link to="/supported-browsers" target="_blank">Supported browsers</Link>
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

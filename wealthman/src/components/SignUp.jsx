import React, { Component } from 'react';
import { setReduxState } from '../redux/index';
import { Link } from 'react-router-dom';

import { api, setCookie, getCookie } from './helpers'
import auth from './auth'
import '../css/AuthWindows.sass';
import Form from './pages/registration/Form';
import questions from './pages/registration/questions';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      login: '',
      password: '',
      passwordRepeat: '',
      register: this.props.forManagers ? '' : 'investor'
    }
  }
  hide(event, forced=false) {
    if (forced || event.target.classList.contains('close-modal-btn') || 
          event.target.classList.contains('modal-wrapper'))
      this.props.hide()
  }
  sendAllForms(data) {
    api.post('register', {
      login: this.state.login,
      password: this.state.password,
    })
      .then((res) => {
        setCookie('accessToken', res.data.token)
        if (res.data.confirmToken)
          this.setState({confirmToken: res.data.confirmToken})
        this.sendDetails(data)
      })
      .catch(console.log);
  }
  sendDetails(data) {
    console.log('sendDetails')
    api.post(this.state.register + '/data', data)
      .then((res) => {
        console.log('res.data')
        this.setState({step: 2})
        auth()
        if (typeof this.props.callback === 'function')
          this.props.callback()
      })
      .catch(console.log);
  }

  render() {
    return (
      <div onClick={(event) => this.hide(event)} className={this.props.visible ? 'modal-wrapper visible' : 'modal-wrapper'}>
        <div className="auth-box registration-box">
          <div className="close-modal-btn">
          </div>
          <h2>Sign up to WealthMan{this.props.forManagers ? ' as manager.' : '.'}</h2>
          <small>Enter your details below.</small>
          {this.state.step !== 0 ? '' : <React.Fragment>
          <div className="row firts-input-row">
            <label>Email address</label>
            <input value={this.state.login} onChange={(event) => this.setState({login: event.target.value})} type="text" placeholder="username@email.com" />
          </div>
          <div className="row">
            <label>Password</label>
            <input value={this.state.password} onChange={(event) => this.setState({password: event.target.value})} type="password" placeholder="Enter your password" />
          </div>
          <div className="row">
            <input value={this.state.passwordRepeat} onChange={(event) => this.setState({passwordRepeat: event.target.value})} type="password" placeholder="Repeat your password" />
          </div>
          <div className="row submit-row">
            <button className="big-blue-button auth-btn" onClick={() => this.state.password === this.state.passwordRepeat ? this.setState({step: 1}) : alert('Passwords are not equal')}>Continue</button>
            <br />
            <small>By clicking “Continue” I agree to <a href="http://google.com" target="_blank">Terms of Service</a> and <a href="http://google.com" target="_blank">Privacy Policy</a></small>
          </div>
          <div className="devider"></div>
          <div className="row footer-row">
            Already have an account?
            <a onClick={() => this.props.openSignIn()} className="another-auth-window-link">Sign in</a>
          </div>
        </React.Fragment>}
         {this.state.step !== 1 ? '' : <div>
            {this.state.register !== '' ? <Form
              questions={questions[this.state.register]}
              onSubmit={(data) => this.sendAllForms(data)}
            /> : <React.Fragment>
              <div className="row">
                <button className="big-blue-button auth-btn" onClick={() => this.setState({register: 'manager'})}>
                  Register manager
                </button>
              </div>
              <div className="row">
                <button className="big-blue-button auth-btn" onClick={() => this.setState({register: 'company'})}>
                  Register company
                </button>
              </div>
            </React.Fragment>
          }
         </div>}
         {this.state.step !== 2 ? '' : <div>
            {false && /[^\.@]+@[^\.]+\..+/.test(this.state.login) ?
            <div>
              <div className="row">
                Email send to <b>{this.state.login}</b>
              </div>
              <div className="row">
                <a href={'https://' + this.state.login.substr(this.state.login.indexOf('.'))}>Go to {this.state.login.substr(this.state.login.indexOf('.'))}</a>
              </div>
            </div> :
            <div>
              <div className="row">
                <small>It is availible only in developer version!</small>
              </div>
              <div className="row">
                Your login is not a valid email so to confirm it go to <a href={'http://platform.wealthman.io:8080/api/confirm-email/' + this.state.confirmToken}>link</a>
              </div>
              <div className="row">
                <button className="big-blue-button auth-btn" onClick={() => this.props.hide()}>I have comfirmed</button>
              </div>
            </div>}
         </div>}
        </div>
      </div>
    );
  }
}

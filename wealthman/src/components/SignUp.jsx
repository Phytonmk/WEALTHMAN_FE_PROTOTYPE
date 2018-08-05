import React, { Component } from 'react';
import { setReduxState } from '../redux/index';
import { Link } from 'react-router-dom';

import { api, setCookie, getCookie } from './helpers'
import auth from './auth'
import '../css/AuthWindows.sass';
import Form from './pages/registration/Form';
import questions from './pages/registration/questions';
import Input from './Input'


export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      login: '',
      password: '',
      passwordRepeat: '',
      register: this.props.forManagers ? '' : 'investor',
      notConfirmed: false
    }
  }
  hide(event=({target: {classList: {contains: () => false}}}), forced=false) {
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
        auth()
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
      })
      .catch(console.log);
  }
  confirm() {
    auth((confirmed) => {
      console.log(confirmed)
      if (confirmed) {
        this.hide(null, true)
        if (typeof this.props.callback === 'function')
          this.props.callback()
      } else {
        this.setState({notConfirmed: true})
      }
    })
  }

  render() {
    return (
      <div onClick={(event) => this.hide(event)} className={this.props.visible ? 'modal-wrapper visible' : 'modal-wrapper'}>
        <div className="auth-box registration-box">
          <div className="close-modal-btn">
          </div>
          <h2>Sign up to WealthMan{this.props.forManagers ? ' as manager.' : '.'}</h2>
          <span>Enter your details below.</span>
          {this.state.step !== 0 ? '' : <React.Fragment>
          <div className="row first-input-row">
            <label>Email address</label>
            <Input value={this.state.login} setValue={value => this.setState({login: value})} placeholder="username@email.com" />
          </div>
          <div className="row">
            <label>Password</label>
            <Input value={this.state.password} setValue={value => this.setState({password: value})} type="password" placeholder="Enter your password" />
          </div>
          <div className="row">
            <Input value={this.state.passwordRepeat} setValue={value => this.setState({passwordRepeat: value})} type="password" placeholder="Repeat your password" />
          </div>
          <div className="row submit-row">
            <button className="big-blue-button auth-btn" onClick={() => this.state.password === this.state.passwordRepeat ? this.setState({step: 1}) : alert('Passwords are not equal')}>Continue</button>
            <br />
            <small>By clicking “Continue” I agree to <Link to="/user-agreement" target="_blank">Terms of Service</Link> and <Link to="/user-agreement" target="_blank">Privacy Policy</Link></small>
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
            {/^[^@]+@{1}[^\.]+\.{1}.+$/.test(this.state.login) ?
            <div>
              <div className="row">
                Email send to <b>{this.state.login}</b>
              </div>
              <div className="row">
                Confirm your email and then push the button below
              </div>
              <div className="row">
                <a target="_blank" href={'https://' + this.state.login.substr(this.state.login.indexOf('@') + 1)}>Go to {this.state.login.substr(this.state.login.indexOf('@') + 1)}</a>
              </div>
            </div> :
            <div>
              <div className="row">
                <small>It is availible only in developer version!</small>
              </div>
              <div className="row">
                Your login is not a valid email so to confirm it go to <a target="_blank" href={'http://platform.wealthman.io:8080/api/confirm-email/' + this.state.confirmToken}>link</a>
              </div>
            </div>}
            <div className="row">
              <button className="big-blue-button auth-btn" onClick={() => this.confirm()}>I have comfirmed</button>
            </div>
            {!this.state.notConfirmed ? '' : <small>Seems like you haven't</small>}
         </div>}
        </div>
      </div>
    );
  }
}

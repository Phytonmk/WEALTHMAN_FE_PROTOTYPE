import React, { Component } from 'react';
import { setReduxState } from '../redux/index';
import { Link } from 'react-router-dom';

import '../css/AuthWindows.sass';
import Form from './pages/registration/Form';
import questions from './pages/registration/questions';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      forManagers: false,
      login: '',
      password: '',
      passwordRepeat: '',
    }
  }
  saveData(data) {

  }
  sendDetails(data) {
    api.post(this.state.register + '/data', Object.assign({accessToken: getCookie('accessToken')}, data))
      .then(() => {setPage('requests'); auth()})
      .catch(console.log);
  }

  render() {
    return (
      <div className="modal-wrapper">
        <div className="auth-box registration-box">
          <div className="close-modal-btn">
          </div>
          <h2>Sign up to WealthMan{this.state.forManagers ? ' as manager or company.' : '.'}</h2>
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
            <Link to="" className="another-auth-window-link">Sign in</Link>
          </div>
        </React.Fragment>}
         {this.state.step !== 1 ? '' : <div>
            <Form
              questions={questions.investor}
              onSubmit={(data) => this.saveData(data)}
            />
         </div>}
        </div>
      </div>
    );
  }
}

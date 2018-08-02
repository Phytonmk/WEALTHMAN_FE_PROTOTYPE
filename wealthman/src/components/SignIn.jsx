import React, { Component } from 'react';
import { setReduxState } from '../redux/index';
import { Link } from 'react-router-dom';

import '../css/AuthWindows.sass';

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div className="modal-wrapper">
        <div className="auth-box">
          <div className="close-modal-btn">
          </div>
          <h2>Sign in to WealthMan.</h2>
          <small>Enter your details below.</small>
          <div className="row firts-input-row">
            <label>Email address</label>
            <input type="text" placeholder="username@email.com" />
          </div>
          <div className="row">
            <label>Password</label>
            <Link to={'#'} className="forgot-password-link">
              Forgot password?
            </Link>
            <input type="text" placeholder="Enter your password" />
          </div>
          <div className="row submit-row">
            <button className="big-blue-button auth-btn">Sign in</button>
            <div>
              <Link to="supported-browsers">Supported browsers</Link>
            </div>
          </div>
          <div className="devider"></div>
          <div className="row footer-row">
            Don’t have an account?
            <Link to="" className="another-auth-window-link">Register now</Link>
          </div>
        </div>
      </div>
    );
  }
}

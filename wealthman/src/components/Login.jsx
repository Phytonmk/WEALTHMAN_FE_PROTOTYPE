import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import '../css/Login.sass';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    }
  }

  render() {
    return (
      <div className="transparent-overlay" onClick={() => this.props.close()}>
        <div className="login-form">
          <button className="cross" onClick={() => this.props.close()} />
          <h1>Log in to WealthMan.</h1>
          <div className="row">
            <span>Enter your details below.</span>
          </div>
          <small className="label">EMAIL ADDRESS</small>
          <input
            value={this.state.email}
            onChange={event => this.setState({email: event.target.value})}
            placeholder="username@email.com"
          />
          <div className="row">
            <small className="label">PASSWORD</small>
            <Link to="/" className="right">
              <small>Forgot password?</small>
            </Link>
          </div>
          <input
            type="password"
            value={this.state.password}
            onChange={event => this.setState({password: event.target.value})}
            placeholder="Enter your password"
          />
          <button className="big-blue-button">SIGN IN</button>
        </div>
      </div>
    );
  }
}

export default Login;

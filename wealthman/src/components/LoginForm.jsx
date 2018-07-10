import React, { Component } from 'react';
import { setReduxState } from '../redux';
import { Link } from 'react-router-dom'

const logoWhite = '../img/logo.svg';
const logoBlue = '../img/logo_blue.svg';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      password: "",
    }
  }
  render() {
    return (
      <div className="login-box">
        <div className="row">
          <img src={logoBlue} className="logo"/>
        </div>
        <h3>{this.props.title}</h3>
        <b>Email Address:</b>
        <input type="text" value={this.state.login} onChange={(event) => this.setState({ login: event.target.value })} placeholder="Enter email" />
        <b>Password:</b>
        <input type="password" value={this.state.password} onChange={(event) => this.setState({ password: event.target.value })} placeholder="Enter password" />
        <Link to="#">
          <button className="login" onClick={() => this.props.tryLogin(this.state.login, this.state.password)}>Log in</button>
        </Link>
        <div className="row-padding">
          <label htmlFor="remember">
            <input type="checkbox" id="remember" />
            Remember me
          </label>
        </div>
        <div className="row-padding">
          <span className="blue-text">Forgot password?</span>
        </div>
        <Link to={"/register"} onClick={() => this.props.setPage("register")}>
          <button className="register">Register</button>
        </Link>
        <div className="row text-center">
          <Link to="/supported-browsers" onClick={() => this.props.setPage("supported-browsers")}>
            <span className="blue-text">
              supported browsers
            </span>
          </Link>
        </div>
      </div>
    );
  }
        // {/* <input type="text" value={this.state.login} onChange={(event) => setReduxState({ login: event.target.value })} placeholder="me@example.com" /> */}
        // {/* <input type="password" value={this.state.password} onChange={(event) => setReduxState({ password: event.target.value })} placeholder="password" /> */}
        // {/* <b>Or via</b>
        // <div className="row">
        //   <button className="facebook"></button>
        //   <button className="google"></button>
        // </div> */}
        ////  <div className="row-padding">
        ////   <small>Not registered yet?</small>
        ////   <Link to={"/register"}>Register</Link>
        //// </div>
}
export default LoginForm
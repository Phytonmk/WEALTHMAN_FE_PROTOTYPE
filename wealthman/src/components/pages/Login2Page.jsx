import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';

import LoginForm from '../LoginForm'

class Login2Page extends Component {
    tryLogin(login, password) {
    if (typeof login === "undefined") {
      login = this.props.login;
      password = this.props.password;
    }

    if (password == "123" && login == "investor")
      setReduxState({
        user: 0,
        currentPage: "portfolios"
      });
    if (password == "123" && login == "manager")
      setReduxState({
        user: 1,
        currentPage: "requests"
      });
    if (password == "123" && login == "supplier")
      setReduxState({
        user: 2,
        currentPage: "managers"
      });
  }
  setPage(page, id) {
    var prevousPages = this.props.prevousPages.slice();
    prevousPages.push(this.props.currentPage);
    if (typeof id !== "undefined")
      switch (page) {
        case "manager":
          setReduxState({currentManager: id})
          break;
        case "algorythm":
          setReduxState({currentAlgorythm: id})
          break;
        case "portfolio":
          setReduxState({currentPortfolio: id})
          break;
        case "request":
          setReduxState({currentRequest: id})
          break;
      }

    setReduxState({
      currentPage: page,
      prevousPages: prevousPages,
      currentAccountPage: "personal",
      currentPortfoliosPage: "active",
    });
  }
  render () {
    return (
      <div>
        <LoginForm title="Login for Wealth Managers" tryLogin={(login, password) => this.tryLogin(login, password)} setPage={(page, id) => this.setPage(page, id)} />
        {/* <LoginForm title="Log in as Manager" tryLogin={(login, password) => this.tryLogin(login, password)} />
        <LoginForm title="Log in as Data Supplier" tryLogin={(login, password) => this.tryLogin(login, password)} /> */}
      </div>
    );
    return (
      <div className="login-box">
        <h3>Welcome back</h3>
        <b>Email</b>
        <input type="text" value={this.state.login} onChange={(event) => setReduxState({ login: event.target.value })} placeholder="me@example.com" />
        <b>Password</b>
        <input type="password" value={this.state.password} onChange={(event) => setReduxState({ password: event.target.value })} placeholder="password" />
        {/* <h3>Choose your role</h3>
        <select>
          <option onClick={() => setReduxState({ login: "investor", password: "123" })}>investor</option>
          <option onClick={() => setReduxState({ login: "manager", password: "123" })}>manager</option>
        </select> */}
        <button className="login" onClick={() => this.tryLogin()}>Log in</button>
      </div>
    );
  }
}

export default connect(a => a)(Login2Page)
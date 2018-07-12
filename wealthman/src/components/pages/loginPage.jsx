import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';

import axios from 'axios';

import LoginForm from '../LoginForm'

import { api, getCookie, setCookie, setPage } from '../helpers';

class loginPage extends Component {
  constructor(props) {
    super(props);
  }
  tryLogin(login, password) {
    if (typeof login === "undefined") {
      login = this.props.login;
      password = this.props.password;
    }

    console.log('try login', login, password)
    api.post('login', {login, password})
      .then((res) =>{
        console.log(res.data);
        setCookie('accessToken', res.data.accessToken);
        setCookie('usertype', res.data.usertype);
        if (res.data.usertype == 0) {
          setReduxState({user: 0});
          setPage('portfolios');
        }
        else if (res.data.usertype == 1) {
          setReduxState({user: 1});
          setPage('requests');
        }
        else if (res.data.usertype == 2) {
          setReduxState({user: 2});
          setPage('managers');
        }
      })
      .catch(console.log);
  }
  render() {
    return (
      <div className="container">
        <LoginForm title="" tryLogin={(login, password) => {this.tryLogin(login, password)}} setPage={(page, id) => {setPage(page, id)}}/>
        {/* <LoginForm title="Log in as Manager" tryLogin={(login, password) => this.tryLogin(login, password)} />
        <LoginForm title="Log in as Data Supplier" tryLogin={(login, password) => this.tryLogin(login, password)} /> */}
      </div>
    );
    return (
      <div className="login-box">
        <h3>Welcome back</h3>
        <b>Email</b>
        <input type="text" value={this.props.login} onChange={(event) => setReduxState({ login: event.target.value })} placeholder="me@example.com" />
        <b>Password</b>
        <input type="password" value={this.props.password} onChange={(event) => setReduxState({ password: event.target.value })} placeholder="password" />
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

export default connect(a => a)(loginPage)
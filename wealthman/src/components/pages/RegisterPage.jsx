import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom'
import ProgressBar from '../ProgressBar.jsx'

import { api, getCookie, setCookie, setPage } from '../helpers';

class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      password: "",
    }
    this.goToAgreement = this.goToAgreement.bind(this);
  }
  goToAgreement(event) {
    if (this.state.login !== '' && this.state.password !== '')
      api.post('register', this.state)
        .then((result) => {
          console.log(result.data);
          setCookie('accessToken', result.data);
          setPage("metamask")})
        .catch(console.log);
    else
      alert('You should fill all inputs to continue registration');
  }
  previousPage() {
    var previousPages = this.props.previousPages.slice();
    if (previousPages.length == 0)
      return;
    var currentPage = previousPages.pop();

    setReduxState({
      currentPage: currentPage,
      previousPages: previousPages
    })
  }
  render () {
    // console.log(this.props.currentManager);
    return(
      <div>
        {/* {this.renderBackButton()} */}
        <div className="container">
          {/*<div className="login-box">
            <h2>Sign up</h2>
            <div className="login-inner-box">
              <div className="login-box-tab">
              </div>
              <div className="login-box-tab">
              </div>
            </div>
          </div>*/}
          <div className="box">
            <h2>Registration page</h2>
              <div className="row">
                <b>Email</b>
              </div>
              <div className="row">
                <input type="text" value={this.state.login} onChange={(event) => this.setState({ login: event.target.value })} placeholder="me@example.com" />
              </div>
              <div className="row">
                <b>Password</b>
              </div>
              <div className="row">
                <input type="password" value={this.state.password} onChange={(event) => this.setState({ password: event.target.value })} placeholder="password" />
              </div>
              <div className="row-padding">
              <Link to={("/manager" + this.props.currentManager)}>
                <button className="back" onClick={() => this.previousPage()}>Back</button>
              </Link>
              <button className="continue" onClick={(event) => this.goToAgreement(event)}>Register</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(a => a)(RegisterPage);

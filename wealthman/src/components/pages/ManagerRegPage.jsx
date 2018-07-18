import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom'

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
    // if (/.+@{1}.+\.{1}.+/.test(this.state.login))
      api.post('register', this.state)
        .then((result) => {
          setCookie('accessToken', result.data);
          setPage("manager-detailing")})
        .catch(console.log);
    // else
    //   alert('You must input email!');
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
          <div className="box">
            <h2>Mangers' registration page</h2>
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
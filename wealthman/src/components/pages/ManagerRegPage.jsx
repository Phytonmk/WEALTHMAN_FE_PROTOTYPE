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
    if (this.state.login !== '' && this.state.password !== '')
      api.post('register', this.state)
        .then((result) => {
          setCookie('accessToken', result.data);
          setPage("manager-detailing")})
        .catch(console.log);
    else
      alert('You should fill all Inputs to continue registration');
  }
  previousPage() {
    var previousPages = thisvaluepreviousPages.slice();
    if (previousPages0)
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
            <h2>Manger's registration page</h2>
              <div className="row">
                <b>Email</b>
              </div>
              <div className="row">
                <Input value={this.state.login} setValue={value => this.setState({ login: value })} placeholder="me@example.com" />
              </div>
              <div className="row">
                <b>Password</b>
              </div>
              <div className="row">
                <Input type="password" value={this.state.password} setValue={value => this.setState({ password: value })} placeholder="password" />
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

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
    api.post('register', this.state)
      .then((result) => {
        console.log(result.data);
        setCookie('accessToken', result.data);
        setPage("email")})
      .catch(console.log);
  }
  prevousPage() {
    var prevousPages = this.props.prevousPages.slice();
    if (prevousPages.length == 0)
      return;
    var currentPage = prevousPages.pop();

    setReduxState({
      currentPage: currentPage,
      prevousPages: prevousPages
    })
  }
  render () {
    // console.log(this.props.currentManager);
    return(
      <div>
        {/* {this.renderBackButton()} */}
        <ProgressBar currentPage={this.props.currentPage}/>
        <div className="container">
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
                <button className="back" onClick={() => this.prevousPage()}>Back</button>
              </Link>
              <Link to={"/email"}>
                <button className="continue" onClick={(event) => this.goToAgreement(event)}>Register</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(a => a)(RegisterPage);
import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ProgressBar from '../ProgressBar.jsx'

import { api, getCookie, setCookie, newLines, setPage, previousPage } from '../helpers';

class RegOrLoginForNewInvestorPage extends Component {
  constructor(props) {
    super(props);
    setReduxState({currentManager: this.props.match.params.manager});
    this.state = {};
  }
  render() {
    return (
      <div>
        <div className="container reg-or-log-in">
          <div className="box">
            <h2>You have to sign in or sign up to continue</h2>
            <div className="container">
              <div className="document-box">
                <h3 className="text-center">
                  <Link to="/login">
                    <button className="continue">
                      Sign in
                    </button>
                  </Link>
                </h3>
              </div>
              <div className="document-box">
                <h3 className="text-center">
                  <Link to="/register">
                    <button className="continue">
                      Sign up
                    </button>
                  </Link>
                </h3>
              </div>
              <div className="row-padding">
                <button className="back" onClick={() => previousPage()}>Back</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(a => a)(RegOrLoginForNewInvestorPage)
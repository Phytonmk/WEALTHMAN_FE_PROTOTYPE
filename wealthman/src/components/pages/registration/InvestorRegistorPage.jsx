import React, { Component } from 'react';
import { setReduxState } from '../../../redux';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import auth from '../../auth.js';
import { api, getCookie, setPage } from '../../helpers';

import Form from './Form';

import questions from './questions';

class InvestorRegistorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  saveData(data) {
    console.log(data);
    api.post('investor/data', Object.assign({accessToken: getCookie('accessToken')}, data))
      .then(() => {
        console.log('Hello!');
        auth();
        if (this.props.currentManager === -1)
          setPage('account');
        else
          setPage('kyc');
      })
      .catch(console.log);
  }
  render() {
    return (
      <div className="container">
          <div className="box">
            <h2>Personal information</h2> 
            <Form
              questions={questions.investor}
              onSubmit={(data) => this.saveData(data)}
            />
          </div>
      </div>
    );
  }
}

export default connect(a => a)(InvestorRegistorPage)
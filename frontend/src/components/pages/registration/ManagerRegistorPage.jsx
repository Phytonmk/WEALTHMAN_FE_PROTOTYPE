import React, { Component } from 'react';
import { setReduxState } from '../../../redux';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import auth from '../../auth.js';
import { api, getCookie, setPage } from '../../helpers';

import Form from './Form';

import questions from './questions';

class ManagerRegistorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      register: ''
    }
  }
  saveData(data) {
    api.post(this.state.register + '/data', Object.assign({accessToken: getCookie('accessToken')}, data))
      .then(() => {setPage('requests'); auth()})
      .catch(console.log);
  }
  render() {
    return (
      <div className="container">
          <div className="box">
            <div>
              <div className="row">
                <label><input type="radio" className="continue" checked={this.state.register == 'manager' } onClick={() => this.setState({register: 'manager'})} /> Registration of manager</label>  
              </div>
              <br />
              <div className="row">
                <label><input type="radio" className="continue" checked={this.state.register == 'company' } onClick={() => this.setState({register: 'company'})} /> Registration of company</label>  
              </div>
              <br />
            </div>
            {this.state.register !== '' ? <Form
              questions={questions[this.state.register]}
              onSubmit={(data) => this.saveData(data)}
            /> : ''}
          </div>
      </div>
    );
  }
}

export default connect(a => a)(ManagerRegistorPage)
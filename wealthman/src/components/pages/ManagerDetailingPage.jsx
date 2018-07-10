import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import axios from 'axios';

import { Link } from 'react-router-dom';

import { api, getCookie, setPage } from '../helpers';

import auth from '../auth.js';

class ManagerDetailingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      register: '',
      // for manager
      name : '',
      surname: '',
      company_name: '',
      company_link: '',
      methodology: '',
      exit_fee: '',
      managment_fee: '',
      font_fee: '',
      performance_fee: '',
      tweeter: '',
      fb: '',
      linkedin: '',
      about: '',
      company: '',
      company_name: '',
      company_link: '',
      founded: '',
      company_size: '',
      headqueartet: '',
      methodology: '',
      fees: '',
      tweeter: '',
      fb: '',
      linkedin: '',
      about: '',
      // for campony
      name : '',
      surname: '',
      tweeter: '',
      fb: '',
      linkedin: '',
      offers: '',
      methodology: '',
      exit_fee: '',
      managment_fee: '',
      font_fee: '',
      performance_fee: '',
      min_investment: ''
    }
  }
  saveData() {
    api.post(this.state.register + '/data', Object.assign({accessToken: getCookie('accessToken')}, this.state))
      .then(() => {setPage('requests'); auth()})
      .catch(console.log);
  }
  render() {
    console.log(this.state.register);
    return (
      <div className="container">
          <div className="box">
            <h2>{this.state.register === '' ? 'What you are going to register?' : `To complete registration of ${this.state.register} submit form`}</h2> 
            { 
              this.state.register === ''
              ?
              <div>
                <div className="row">
                  <button className="continue" onClick={() => this.setState({register: 'manager'})}>Registration of manager</button>  
                </div>
                <br />
                <div className="row">
                  <button className="continue" onClick={() => this.setState({register: 'company'})}>Registration of company</button>  
                </div>
                <br />
              </div>
              :
              <div>
                {questions[this.state.register].map((question, i) => <div key={i}>
                  <div className="row capitalize">
                    {question.replace(/\_/g, ' ')}
                  </div>
                  <div className="row">
                    <input type="text" value={this.state[question]} onChange={(event) => {this.setState({[question]: event.target.value})}} placeholder={question.replace(/\_/g, ' ')} />
                  </div> 
                </div>)}
                <div className="row">
                  <button className="back" onClick={() => this.setState({register: ''})}>Back</button>
                  <button className="continue" onClick={() => this.saveData()}>Save data</button>
                </div>
              </div>
            }
            <br />
          </div>
      </div>
    );
  }
}

export default connect(a => a)(ManagerDetailingPage)

const questions = {
  manager: [
    'name ',
    'surname',
    'company_name',
    'company_link',
    'methodology',
    'exit_fee',
    'managment_fee',
    'font_fee',
    'performance_fee',
    'tweeter',
    'fb',
    'linkedin',
    'about',
  ],
  company: [
    'company',
    'company_name',
    'company_link',
    'founded',
    'company_size',
    'headqueartet',
    'methodology',
    'fees',
    'tweeter',
    'fb',
    'linkedin',
    'about',
  ]
}
/*
check personal/company
personal:
team:
name 
surname
tweeter
fb
linkedin
offers
methodology
exit_fee
managment_fee
font_fee
performance_fee
min_investment

*/
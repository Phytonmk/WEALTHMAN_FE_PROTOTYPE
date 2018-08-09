import React, { Component } from 'react';

import { setReduxState } from '../../../redux'

import { api, getCookie, setCookie, setPage } from '../../helpers';

import questions from './../registration/questions';
import Form from './../registration/Form';

let gotData = false

class OldAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  componentWillMount() {
     api.post('getme', {accessToken: getCookie('accessToken')})
      .then(res => {
        if (/[0-9]+/.test(res.data.usertype))
          this.setState({user: res.data.usertype, userData: res.data.userData || {}})
      })
      .catch(console.log)
  }
  changePassword() {
    if (this.state.old_password !== '' && this.state.new_password1 !== '' &&
      this.state.new_password1 === this.state.new_password2) {
      api.post('changepassword', {
        old_password: this.state.old_password,
        new_password1: this.state.new_password1,
        new_password2: this.state.new_password2,
      })
      .then(() => alert('Password changed'))
      .catch(console.log);
    }
  }
  saveData(data) {
    api.post(this.state.user + '/data', Object.assign({accessToken: getCookie('accessToken')}, data))
      .then(() => {alert('Your new data saved')})
      .catch(console.log);
  }
  render() {
    let user = '-';
    switch (getCookie('usertype') * 1) {
      case 0:
        user = 'investor';
        break;
      case 1:
        user = 'manager';
        break;
      case 3:
        user = 'company';
        break;
    }
    if (user !== this.state.user)
      this.setState({user});
    if (this.state.userData) {
      for (let question in questions[user]) {
        switch(questions[user][question].type) {
          case 'photo_upload':
            if (this.state.userData.img) {
              gotData = true;
              questions[user][question].photo_url = this.state.userData.img;
            }
            break;
          case 'wallet_address':
            if (this.state.userData.wallet_address) {
              gotData = true;
              questions[user][question].value = this.state.userData.wallet_address;
            }
            break;
          case 'services':
            if (this.state.userData.services) {
              gotData = true;
              questions[user][question].services = this.state.userData.services;
            }
            break;
          default:
            if (this.state.userData[questions[user][question].property]) {
              gotData = true;
              questions[user][question].value = this.state.userData[questions[user][question].property];
            }
        }
      }
    }

    return (
      <div>
        <div className="container">
          <div className="first-tab">
            <div className="account-box">
              {gotData ? <Form
                questions={questions[user]}
                onSubmit={(data) => this.saveData(data)}
              /> : 'Loading...'}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OldAccount;

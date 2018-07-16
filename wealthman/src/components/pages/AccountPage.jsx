import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom'
// import ProgressBar from '../ProgressBar.jsx'

import { api, getCookie, setCookie, setPage } from '../helpers';

class AccountPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      old_password: '',
      new_password1: '',
      new_password2: '',
    }
  }
  saveData() {
    if (this.state.old_password !== '' && this.state.new_password1 !== '' &&
      this.state.new_password1 === this.state.new_password2) {
      api.post('changepassword', {
        old_password: this.state.old_password,
        new_password1: this.state.new_password1,
        new_password2: this.state.new_password2,
      })
      .then(() => setPage(''))
      .catch(console.log);
    }
  }
  render() {
    var changed = false;
    var accountPage;
    switch (this.props.currentAccountPage) {
      case "personal":
        accountPage = (
          <div className="box">
            {/* <div className="half padding-side">
              <h3 className="high">Personal Info</h3>
              <input type="text" placeholder="First Name"/>
              <input type="text" placeholder="Last Name"/>
              <input type="text" placeholder="day of birth"/>
              <input type="text" placeholder="month"/>
              <input type="text" placeholder="year"/>
              <input type="text" placeholder="nationality"/>
            </div> */}
            <div className="half padding-side">
              <h3 className="high">Contact information</h3>
              <input type="text" placeholder="email"/>
              <input type="text" placeholder="phone number"/>
              <h3 className="high">Change password</h3>
              <input type="password" placeholder="old password" value={this.state.old_password} onChange={(event) => this.setState({old_password: event.target.value})}/>
              <input type="password" placeholder="new password" value={this.state.new_password1} onChange={(event) => this.setState({new_password1: event.target.value})}/>
              <input type="password" placeholder="repeat new password" value={this.state.new_password2} onChange={(event) => this.setState({new_password2: event.target.value})}/>
            </div>
            <div className="row-padding">
              <button className={changed ? "continue" : "continue"} onClick={() => this.saveData()}>Save changes</button>
            </div>
          </div>
        );
        break;
        case "kyc":
          accountPage = (
            <div className="box">
              <div className="half padding-side">
                <h3 className="high">Personal Info</h3>
                <input type="text" placeholder="First Name"/>
                <input type="text" placeholder="Last Name"/>
                <input type="text" placeholder="phone number"/>
                <input type="text" placeholder="day of birth"/>
                <input type="text" placeholder="month"/>
                <input type="text" placeholder="year"/>
                <input type="text" placeholder="nationality"/>
              </div>
              <div className="half padding-side">
                <h3 className="high">Address Information</h3>
                <input type="text" placeholder="Street Address"/>
                <input type="text" placeholder="Postal Code"/>
                <input type="text" placeholder="City"/>
                <input type="text" placeholder="State"/>
                <input type="text" placeholder="Country"/>
              </div>
              {/* <div className="row-padding">
                <button className={changed ? "continue" : "continue"}>Save changes</button>
              </div> */}
                <div className="row padding-side">
                  <h3 className="high">ID or Passport</h3>
                  <p>Please upload a photo or a scan of the following:</p>
                  <div className="document-box">
                    <h3 className="text-center">ID or Passport</h3>
                    <div className="row">
                      <button className="continue">UPLOAD DOCUMENT</button>
                    </div>
                  </div>
                  <div className="document-box">
                    <h3 className="text-center">Selfie holding ID or Passport</h3>
                    <div className="row">
                      <button className="continue">UPLOAD DOCUMENT</button>
                    </div>
                  </div>
                </div>
            </div>
          );
          break;
      case "risk":
        accountPage = (
          <div className="box">
            <h3>Risk Tollerance Profile</h3>
            Your tisk profile: 25%;
            <div className="row-padding">
              <button className="continue">Change results</button>
            </div>
          </div>
        );
        break;
      case "inv":
        accountPage = (
          <div className="box">
            <h3>Investment goals and strategy aims</h3>
            You are investing for:
            <ul>
              <li>living</li>
              <li>journeys</li>
            </ul>
            <div className="row-padding">
              <button className="continue">Change results</button>
            </div>
          </div>
        );
        break;
    }
    return (
      <div>
        {/* {this.renderBackButton()} */}
        <div className="container">
          <h1 style={{
            marginTop: 20,
            marginLeft: 63,
            marginBottom: 20,
          }}>Account</h1>
          <div className="first-tab">
            {accountPage}
          </div>
          <div className="second-tab">
            <div className="box">
              {/* <button className="transactions-link" onClick={() => setReduxState({ currentAccountPage: "personal" })}>Personal Info</button>
              <button className="transactions-link" onClick={() => setReduxState({ currentAccountPage: "address" })}>Address details</button>
              <button className="transactions-link" onClick={() => setReduxState({ currentAccountPage: "ID" })}>ID confirmation</button>
              <button className="transactions-link" onClick={() => setReduxState({ currentAccountPage: "residency" })}>Residency</button>
              <button className="transactions-link" onClick={() => setReduxState({ currentAccountPage: "forms" })}>Fill forms</button>
              <button className="transactions-link" onClick={() => setReduxState({ currentAccountPage: "kyc" })}>Know Your Criminals</button> */}
              <button style={{width: 'auto'}} className="transactions-link" onClick={() => setReduxState({ currentAccountPage: "personal" })}>Account Information</button>
              {this.props.user == 1 ? "" : <button style={{width: 'auto'}} className="transactions-link" onClick={() => setReduxState({ currentAccountPage: "risk" })}>Risk Tollerance Profile</button>}
              {this.props.user == 1 ? "" : <button style={{width: 'auto'}} className="transactions-link" onClick={() => setReduxState({ currentAccountPage: "inv" })}>Investment goals and strategy aims</button>}
              <button style={{width: 'auto'}} className="transactions-link" onClick={() => setReduxState({ currentAccountPage: "kyc" })}>Detailed information (kyc)</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(a => a)(AccountPage);
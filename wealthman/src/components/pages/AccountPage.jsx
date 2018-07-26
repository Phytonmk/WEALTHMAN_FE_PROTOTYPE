import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom'
// import ProgressBar from '../ProgressBar.jsx'

import { api, getCookie, setCookie, setPage } from '../helpers';

import questions from './registration/questions';
import Form from './registration/Form';

import Subheader from './../Subheader';
import AccountInfo from './account/AccountInfo';
import RiskProfile from './account/RiskProfile';
import Goals from './account/Goals';
import DetailedInfo from './account/DetailedInfo';

let gotData = false

class AccountPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: ''
    }
  }
  componentWillMount() {
    if (this.props.userData === undefined || this.props.userData.wallet_address === undefined) {
      api.post('getme')
        .then((res) => {
          setReduxState({userData: res.data.userData});
          // setTimeout(() => this.forceUpdate(), 0);
        })
        .catch(console.log)
    }
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
  render () {
    return (
      <div>
        <Subheader data={[
          {
            header: "Account Information",
            content: <AccountInfo />,
          },
          {
            header: "Risk Tollerance Profile",
            content: <RiskProfile />,
          },
          {
            header: "Investment Goals And Strategy Aims",
            content: <Goals />,
          },
          {
            header: "Detailed Information",
            content: <DetailedInfo />,
          },
        ]}
      />
      </div>
    );
  }
  // render() {
  //   let user = 'investor';
  //   switch (this.props.user) {
  //     case 0:
  //       user = 'investor';
  //       break;
  //     case 1:
  //       user = 'manager';
  //       break;
  //     case 3:
  //       user = 'company';
  //       break;
  //   }
  //   if (user !== this.state.user)
  //     this.setState({user});
  //   if (this.props.userData) {
  //     for (let question in questions[user]) {
  //       switch(questions[user][question].type) {
  //         case 'photo_upload':
  //           if (this.props.userData.img) {
  //             gotData = true;
  //             questions[user][question].photo_url = this.props.userData.img;
  //           }
  //           break;
  //         case 'wallet_address':
  //           if (this.props.userData.wallet_address) {
  //             gotData = true;
  //             questions[user][question].value = this.props.userData.wallet_address;
  //           }
  //           break;
  //         case 'services':
  //           if (this.props.userData.services) {
  //             gotData = true;
  //             questions[user][question].services = this.props.userData.services;
  //           }
  //           break;
  //         default:
  //           if (this.props.userData[questions[user][question].property]) {
  //             gotData = true;
  //             questions[user][question].value = this.props.userData[questions[user][question].property];
  //           }
  //       }
  //     }
  //   }
  //   let accountPage;
  //   switch (this.state.currentAccountPage) {
  //     case "personal":
  //       accountPage = (
  //         <div className="box">
  //           <h2>Account information</h2>
  //           {gotData ? <Form
  //             questions={questions[user]}
  //             onSubmit={(data) => this.saveData(data)}
  //           /> : 'Loading... if it takes too long - reload page'}
  //         </div>
  //       );
  //       break;
  //       case "password":
  //         accountPage = (
  //           <div className="box">
  //             <div className="half padding-side">
  //               <h3 className="high">Change password</h3>
  //               <input type="password" placeholder="old password" value={this.state.old_password} onChange={(event) => this.setState({old_password: event.target.value})}/>
  //               <input type="password" placeholder="new password" value={this.state.new_password1} onChange={(event) => this.setState({new_password1: event.target.value})}/>
  //               <input type="password" placeholder="repeat new password" value={this.state.new_password2} onChange={(event) => this.setState({new_password2: event.target.value})}/>
  //             </div>
  //             <div className="row-padding">
  //               <button className={this.passwordChanged ? "back" : "continue"} onClick={() => this.changePassword()}>Change password</button>
  //             </div>
  //           </div>
  //         );
  //         break;
  //     case "risk":
  //       accountPage = (
  //         <div className="box">
  //           <h3>Risk Tollerance Profile</h3>
  //           Your tisk profile: 25%;
  //           <div className="row-padding">
  //             <button className="continue">Change results</button>
  //           </div>
  //         </div>
  //       );
  //       break;
  //     case "inv":
  //       accountPage = (
  //         <div className="box">
  //           <h3>Investment goals and strategy aims</h3>
  //           You are investing for:
  //           <ul>
  //             <li>living</li>
  //             <li>journeys</li>
  //           </ul>
  //           <div className="row-padding">
  //             <button className="continue">Change results</button>
  //           </div>
  //         </div>
  //       );
  //       break;
  //   }
  //   return (
  //     <div>
  //       {/* {this.renderBackButton()} */}
  //       <div className="container">
  //         <h1 style={{
  //           marginTop: 20,
  //           marginLeft: 63,
  //           marginBottom: 20,
  //         }}>Account</h1>
  //         <div className="first-tab">
  //           {accountPage}
  //         </div>
  //         <div className="second-tab">
  //           <div className="box">
  //             <button style={{width: 'auto'}} className="transactions-link" onClick={() => this.setState({ currentAccountPage: "personal" })}>Account Information</button>
  //             <br />
  //             <button style={{width: 'auto'}} className="transactions-link" onClick={() => this.setState({ currentAccountPage: "password" })}>Change Password</button>
  //             {/* <button className="transactions-link" onClick={() => this.setState({ currentAccountPage: "personal" })}>Personal Info</button>
  //             <button className="transactions-link" onClick={() => this.setState({ currentAccountPage: "address" })}>Address details</button>
  //             <button className="transactions-link" onClick={() => this.setState({ currentAccountPage: "ID" })}>ID confirmation</button>
  //             <button className="transactions-link" onClick={() => this.setState({ currentAccountPage: "residency" })}>Residency</button>
  //             <button className="transactions-link" onClick={() => this.setState({ currentAccountPage: "forms" })}>Fill forms</button>
  //             <button className="transactions-link" onClick={() => this.setState({ currentAccountPage: "kyc" })}>Know Your Criminals</button> */}
  //             {/*{this.props.user == 1 ? "" : <button style={{width: 'auto'}} className="transactions-link" onClick={() => this.setState({ currentAccountPage: "risk" })}>Risk Tollerance Profile</button>}
  //             {this.props.user == 1 ? "" : <button style={{width: 'auto'}} className="transactions-link" onClick={() => this.setState({ currentAccountPage: "inv" })}>Investment goals and strategy aims</button>}
  //             <button style={{width: 'auto'}} className="transactions-link" onClick={() => this.setState({ currentAccountPage: "kyc" })}>Detailed information (kyc)</button>*/}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
}

export default connect(a => a)(AccountPage);

import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { api, setPage, setCurrency, prevousPage } from '../helpers';

class WithdrawPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  send() {
    api.post('request', {manager: this.props.currentManager})
      .then(() => {
        setPage('requests');
      })
      .catch(console.log);
  }
  render() {
    return(
      <div>
        {/* {this.renderBackButton()} */}
        {/*this.renderProgressBar()*/}
        <div className="container">
          <div className="box">
            <h2>Witdraw you money</h2>
            <div className="row-padding">
              <p>Withdrawing... 💰💰💰</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default connect(a => a)(WithdrawPage);
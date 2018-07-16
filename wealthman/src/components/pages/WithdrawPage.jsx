import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { api, setPage, setCurrency, previousPage } from '../helpers';

class WithdrawPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return(
      <div>
        {/* {this.renderBackButton()} */}
        {/*this.renderProgressBar()*/}
        <div className="container">
          <div className="box">
            <h2>Witdrawing portfolio #14</h2>
            <div className="row-padding">
              <p>Withdrawing address: <b>0x18Dda87E2b73D58827a6dEfA99E2b86241CEDDe9</b></p>
            </div>
            <div className="row-padding">
              <p>Sum: <b>1 000 000 $ (1234 Eth) </b></p>
            </div>
            <div className="row-padding">
              <p><button className="continue">Widthdraw</button></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default connect(a => a)(WithdrawPage);
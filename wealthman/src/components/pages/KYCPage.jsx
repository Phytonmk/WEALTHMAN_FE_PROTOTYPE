import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { api, setPage, setCurrency, prevousPage } from '../helpers';

class KYCPage extends Component {
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
            <h2>Know Your Criminals</h2>
            <div className="row-padding">
              <p>by clicking send, u send this data to manager</p>
            </div>
            <div className="row-padding">
              <Link to={"/manager form"}>
                <button className="back" onClick={() => prevousPage()}>Back</button>
              </Link>
              <button className="continue" onClick={() => this.send()}>Send to manager</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default connect(a => a)(KYCPage);
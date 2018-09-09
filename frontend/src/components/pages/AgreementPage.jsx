import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ProgressBar from '../ProgressBar'

import { api, getCookie, setCookie, newLines, setPage } from '../helpers';

class AgreementPage extends Component {
  constructor(props) {
    super(props);
  }
  agree () {
    api.post('investor/agree')
      .then(() =>{
        setCookie('usertype', '0');
        setPage("static form");
      })
      .catch(console.log);
  }
  render() {
    return (
      <div>
        {/* {this.renderBackButton()} */}
        <ProgressBar  currentPage={this.props.currentPage} />
        <div className="container">
          <div className="box">
            <h1 className="text-center">Agreement</h1>
            {newLines(this.props.agreement)}
            <div className="row-padding">
              <Link to={"/email"}>
                <button className="back" onClick={() => this.previousPage()}>Back</button>
              </Link>
              <Link to={"/static form"}>
                <button className="continue" onClick={() => this.agree()}>Agree</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(a => a)(AgreementPage)
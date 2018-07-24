import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ProgressBar from '../ProgressBar.jsx'

import { api, getCookie, setCookie, newLines, setPage } from '../helpers';

class ChatPage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        {/* {this.renderBackButton()} */}
        <ProgressBar  currentPage={this.props.currentPage} />
        <div className="container">
          <div className="box">
            <h1 className="text-center">Chat</h1>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(a => a)(ChatPage)
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import myDate from '../../myDate.jsx';

class Header extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div className="row">
          <div className="circle left">
            <img src={this.props.img} className="avatar" />
          </div>
          <div className="third">
            <h4>{this.props.name}</h4>
            <p>user id #<b>{this.props.userId}</b></p>
          </div>
          <div className="third text-right">
            <p>request number #<b>{this.props.requestId}</b></p>
            <p>created: <b>{new myDate(this.props.requestDate).niceTime()}</b></p>
          </div>
          <div className="row-padding">
            <Link to={"/chat/" + this.props.userId}>
              <button className="continue" onClick={() => this.setPage("chat")}>Start chat</button>
            </Link>
          </div>
        </div>
        <div className="row">
          {this.props.buttons}
        </div>
      </div>)
  }
}

export default Header;
import React, { Component } from 'react';

class RiskProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div>
        <div className="account-box">
          <small>YOU ARE INVESTING FOR</small>
          <ul>
            <li>Living</li>
            <li>Journeys</li>
          </ul>
          <button className="big-blue-button">
            change results
          </button>
        </div>
      </div>
    );
  }
}

export default RiskProfile;

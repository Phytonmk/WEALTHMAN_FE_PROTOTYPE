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
          <small>YOUR RISK PROFILE</small>
          <h1>25%</h1>
          <button className="big-blue-button">
            change results
          </button>
        </div>
      </div>
    );
  }
}

export default RiskProfile;

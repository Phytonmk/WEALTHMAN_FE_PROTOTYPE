import React, { Component } from 'react';

class ProgressBar extends Component {
  render() {
    var pages = ["register", "email", "agreement", "static form", "dynamic form", "manager form", "kyc", "thanks2", "accept", "signagreement", "money", "investor register"];
    var progress = pages.indexOf(this.props.currentPage.toLowerCase()) + 2;
    var total = pages.length + 1;
    return <div className="progress" style={{width: (100 / total * progress) + "%"}}></div>
  }
}

export default ProgressBar;
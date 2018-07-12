import React, { Component } from 'react';

class ProgressBar2 extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    var progress = this.props.step;
    var total = this.props.total;
    console.log((100 / total * progress))
    return <div className="progress progress-bar" style={{width: (100 / total * progress) + "%"}}></div>
  }
}

export default ProgressBar2;
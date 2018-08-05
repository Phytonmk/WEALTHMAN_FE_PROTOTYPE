import React, { Component } from 'react';

import '../css/Textarea.sass';

class Textarea extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <textarea
        value={this.props.value}
        onChange={(event) => this.props.setValue(event.target.value)}
        placeholder={this.props.placeholder}
      />
    );
  }
}

export default Textarea;

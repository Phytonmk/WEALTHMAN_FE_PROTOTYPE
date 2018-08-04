import React, { Component } from 'react';

import '../css/Input.sass';

{/*
  //  //  //              USAGE EXAMPLE              //  //  //

<Input
  //(REQUIRED) value to show
  value={this.state.status}
  //(REQUIRED) function that sets the value
  setValue={(value) => this.setState({status: value})}
  //(OPTIONAL) type of the input (text or password for now)
  type={this.props.type}
  //(OPTIONAL) placeholder for the input
  placeholder={this.props.placeholder}
/>
*/}

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <input
        value={this.props.value}
        onChange={(event) => this.props.setValue(event.target.value)}
        type={this.props.type}
        placeholder={this.props.placeholder}
        className="default"
      />
    );
  }
}

export default Input;

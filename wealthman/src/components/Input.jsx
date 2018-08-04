import React, { Component } from 'react';

import '../css/Input.sass';

{/*
  //  //  //              USAGE EXAMPLE              //  //  //

<Input
  //(REQUIRED) value to show
  value={this.state.password}
  //(REQUIRED) function that sets the value
  setValue={(value) => this.setState({password: value})}
  //(OPTIONAL) type of the input (text or password for now)
  type={"password"}
  //(OPTIONAL) placeholder for the input
  placeholder={"enter password"}
  //(OPTIONAL) error message when value is incorrect (if error undefined, field is normal, if error is "" or anything else, field is red)
  error={this.state.incorrectPassword ? "incorrect password" : undefined}
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
        className={"default " + (this.props.error ? "error" : "")}
      />
    );
  }
}

export default Input;

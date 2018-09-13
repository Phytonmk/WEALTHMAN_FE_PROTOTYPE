import React, { Component } from 'react';

import '../../css/Checkbox.sass';

{/*
  //  //  //              USAGE EXAMPLE              //  //  //

<Checkbox
  //(REQUIRED) value
  value={this.state.value}
  //(REQUIRED) function that sets the value
  setValue={(value) => this.setState({value: value})}
  //(OPTIONAL) label for the value
  label={"expression"}
/>
*/}

class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        className={"checkbox " + (this.props.value ? "checked" : "")}
        onClick={() => this.props.setValue(!this.props.value)}
      >
        {this.props.label}
      </div>
    );
  }
}

export default Checkbox;

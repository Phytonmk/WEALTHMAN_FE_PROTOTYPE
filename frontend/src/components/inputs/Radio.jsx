import React, { Component } from 'react';

import '../../css/Radio.sass';

{/*
  //  //  //              USAGE EXAMPLE              //  //  //

<Radio
  //(REQUIRED) value
  value={this.state.value}
  //(REQUIRED) function that sets the value
  setValue={(value) => this.setState({value: value})}
  //(REQUIRED) options to choose from
  options={["1", "2", "3", "4", "5"]}
/>
*/}

class Radio extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="radio">
        <div className="options">
          {
            this.props.options.map(option =>
              <div
                className={"option " + (this.props.value == option ? "selected" : "")}
                onClick={() => this.props.setValue(option)}
              >
                {option}
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default Radio;

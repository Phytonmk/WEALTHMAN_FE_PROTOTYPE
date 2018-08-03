import React, { Component } from 'react';

import '../css/Radio.sass';

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

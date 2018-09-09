import React, { Component } from 'react';
import $ from 'jquery';

import '../../css/Select.sass';

{/*
  //  //  //              USAGE EXAMPLE              //  //  //

<Select
  //(REQUIRED) value to show
  value={this.state.status}
  //(REQUIRED) options of the select
  options={["All", "Declined", "Accepted", "Cancelled", "Pending"]}
  //(REQUIRED) function that sets the value
  setValue={(value) => this.setState({status: value})}
  //(OPTIONAL) width of the element
  width="135px"
  //(OPTIONAL) amount of shown options, others will be wisible after scroll (default 6)
  maxShown={5}
/>
*/}

class Select extends Component {
  constructor(props) {
    super(props);

    let error = "";
    if (typeof props.value == "undefined")
      error += "you must define 'value' prop; ";
    if (typeof props.options == "undefined")
      error += "you must define 'options' prop; ";
    if (typeof props.setValue == "undefined")
      error += "you must define 'setValue' prop; ";

    this.state = {
      opened: false,
      error: error,
    }
  }

  componentWillMount() {
    $(window).click(event => {
      if (!event.target.className.includes("select"))
        this.setState({opened: false});
    });
  }

  render() {
    if (this.state.error != "")
      return "error: " + this.state.error;
    return (
      <div
        className="select"
        onClick={() => this.setState({opened: !this.state.opened})}
      >
        {this.props.value}
        {
          this.state.opened ?
            <div
              className="options"
              style={{
                width: (this.props.width ? this.props.width : ""),
                maxHeight: (this.props.maxShown ? (this.props.maxShown * 47 + 10 + "px") : (6 * 47 + 10 + "px")),
              }}
            >
              {
                this.props.options.map(option =>
                  <div className="option"
                    key={option}
                    onClick={() => this.props.setValue(option)}
                  >
                    {option}
                  </div>
                )
              }
            </div>
            : ""
        }
      </div>
    );
  }
}

export default Select;

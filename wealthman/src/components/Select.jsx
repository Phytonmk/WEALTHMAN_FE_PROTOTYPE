import React, { Component } from 'react';
import $ from 'jquery';

import '../css/Select.sass';

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
/>
*/}

class Select extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      error: "",
    }
  }

  componentWillMount() {
    if (typeof this.props.value == "undefined")
      this.setState({error: this.state.error + "you must define 'value' prop; "});
    if (typeof this.props.options == "undefined")
      this.setState({error: this.state.error + "you must define 'options' prop; "});
    if (typeof this.props.setValue == "undefined")
      this.setState({error: this.state.error + "you must define 'setValue' prop; "});

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
        // style={{width: (this.props.width ? this.props.width : "200px")}}
        onClick={() => this.setState({opened: !this.state.opened})}
      >
        {this.props.value}
        {
          this.state.opened ?
            <div className="options" style={{width: (this.props.width ? this.props.width : "200px")}}>
              {
                this.props.options.map(option =>
                  <div className="option"
                    key={option}
                    onClick={() => {
                      this.props.setValue(option);
                  }}>
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

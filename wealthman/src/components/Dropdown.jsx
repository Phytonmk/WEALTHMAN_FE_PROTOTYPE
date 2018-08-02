import React, { Component } from 'react';
import ReactDOM from "react-dom";

import '../css/Dropdown.sass';

{/*
  //  //  //              USAGE EXAMPLE              //  //  //

<Dropdown
  //(REQUIRED) value to show
  value={this.state.status}
  //(REQUIRED) options of the select
  options={["All", "Declined", "Accepted", "Cancelled", "Pending"]}
  //(REQUIRED) function that sets the value
  setValue={(value) => this.setState({status: value})}
  //(OPTIONAL) placeholder
  placeholder="choose your city"
  //(OPTIONAL) width of the element
  width="135px"
  //(OPTIONAL) amount of shown options, others will be wisible after scroll (default 6)
  maxShown={5}
/>
*/}

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      inputValue: "",
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
  }

  render() {
    if (this.state.error != "")
      return "error: " + this.state.error;

    return (
      <div
        className={"dropdown " + (this.state.opened ? "opened" : "")}
        style={{
          width: (this.props.width ? this.props.width : ""),
        }}
        //to open menu when clicked on arrow (which overlays input)
        onClick={() => {
          let dropdown = ReactDOM.findDOMNode(this);
          if (dropdown instanceof HTMLElement)
            dropdown.getElementsByTagName("input")[0].focus()
        }}
      >
        <input
          value={this.state.inputValue}
          onChange={event => {
            this.setState({inputValue: event.target.value});
            //invalidate window when correct spelling wass changed
            if (event.target.value != this.props.value)
              this.props.setValue("");
            //validate if existing option was inputed (not selected)
            let correctOptionInputed = this.props.options
              .map(option => option.toLowerCase())
              .indexOf(event.target.value.toLowerCase());
            // alert(correctOptionInputed + event.target.value.toLowerCase() + ": " + this.props.options.map(option => option.toLowerCase()));
            if (correctOptionInputed != -1) {
              this.props.setValue(this.props.options[correctOptionInputed]);
              this.setState({inputValue: this.props.options[correctOptionInputed]});
            }
          }}
          placeholder={this.props.placeholder}
          onFocus={() => this.setState({opened: true})}
          //timeout needed to actually click on option, before menu closes
          onBlur={() => setTimeout(() => this.setState({opened: false}), 100)}
          className={(this.state.inputValue != this.props.value) && !this.state.opened ? "error" : ""}
        />
        {
          this.state.opened ?
            <div
              className="options"
              style={{
                maxHeight: (this.props.maxShown ? (this.props.maxShown * 47 + 10 + "px") : (6 * 47 + 10 + "px")),
              }}>
              {
                this.props.options
                .filter(option => option.toLowerCase().includes(this.state.inputValue.toLowerCase()))
                .map(option =>
                  <div className="option"
                    key={option}
                    onClick={() => {
                      this.setState({
                        inputValue: option,
                        opened: false
                      });
                      this.props.setValue(option);
                    }}
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

export default Dropdown;

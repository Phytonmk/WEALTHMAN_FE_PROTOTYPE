import React, { Component } from 'react';
import ReactDOM from "react-dom";

import { clamp } from './helpers';
import Slider from './Slider';

import '../css/AgeSlider.sass';

{/*
  //  //  //              USAGE EXAMPLE              //  //  //

<AgeSlider
  //(REQUIRED) value to input (if user inputs incorrect value this property will be "")
  value={this.props.value}
  //(REQUIRED) function that sets the value
  setValue={this.props.setValue}
  //(REQUIRED) minimum value
  from={this.props.typeSpecific.from}
  //(REQUIRED) maximum value
  to={this.props.typeSpecific.to}
  //(OPTIONAL) minimum value change (default 1)
  step={this.props.typeSpecific.step}
/>
*/}

class AgeSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draggable: false,
      value: props.value,
      step: props.step ? props.step : 1,
    };
  }

  render() {
    let width = !this.props.value || this.props.value == "" ? 0 :
    (clamp(this.props.value, this.props.from, this.props.to) - this.props.from) / (this.props.to - this.props.from);
    let lineWidth = "calc(9px + (100% - 18px) * " + width + ")";
    let dotOffset = "calc((100% - 18px) * " + width + ")";

    return (
      <div className="age-slider">
        <div className="input-column">
          <div className="row">
            <small>Age</small>
          </div>
          <input
            value={this.state.value}
            onChange={event => {
              let number = event.target.value.replace(/[^0-9]/g, '');

              if (number >= this.props.from && number <= this.props.to) {
                this.props.setValue(number);
                this.setState({value: number});
              }
              else {
                this.props.setValue("");
                this.setState({value: number});
              }
            }}
          />
        </div>
        <div className="slider-column">
          <Slider
            value={this.props.value}
            setValue={value => {
              this.props.setValue(value);
              this.setState({value: value});
            }}
            from={this.props.from}
            to={this.props.to}
            step={this.props.step}
          />
          <small>Adjust slider or enter a value</small>
        </div>
      </div>
    );
  }
}

export default AgeSlider;

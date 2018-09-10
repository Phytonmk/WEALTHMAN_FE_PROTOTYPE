import React, { Component } from 'react';
import ReactDOM from "react-dom";

import { clamp } from './../helpers';
import Slider from './Slider';

import '../../css/SliderWithInput.sass';

{/*
  //  //  //              USAGE EXAMPLE              //  //  //

<SliderWithInput
  //(REQUIRED) value to input (if user inputs incorrect value this property will be "")
  value={this.state.value}
  //(REQUIRED) function that sets the value
  setValue={this.state.setValue}
  //(REQUIRED) minimum value
  from={0}
  //(REQUIRED) maximum value
  to={100}
  //(OPTIONAL) label for the value
  valueLabel={numberToText(this.state.value)}
  //(OPTIONAL) minimum value label
  fromLabel={"zero"}
  //(OPTIONAL) maximum value label
  toLabel={"hundred"}
  //(OPTIONAL) minimum value change (default 1)
  step={1}
  //(OPTIONAL) text above input
  inputLabel={"Age"}
/>
*/}

class SliderWithInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
            <small>{this.props.inputLabel}</small>
          </div>
          <input
            value={this.state.value}
            onChange={event => {
              let number = event.target.value.replace(/[^0-9]/g, '');
              number = clamp(number, this.props.from, this.props.to);
              this.props.setValue(number);
              this.setState({value: number});
            }}
          />
        </div>
        <div className="slider-column">
          <Slider
            {...this.props}
            setValue={value => {
              this.props.setValue(value);
              this.setState({value: value});
            }}
          />
          <p>Adjust slider or enter a value</p>
        </div>
      </div>
    );
  }
}

export default SliderWithInput;

import React, { Component } from 'react';
import ReactDOM from "react-dom";

import { clamp } from './helpers';

import '../css/Slider.sass';

{/*
  //  //  //              USAGE EXAMPLE              //  //  //

  <Slider
    //(REQUIRED) value to show
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

class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draggable: false,
      step: props.step ? props.step : 1,
    };
  }

  handleMouseDown(event) {
    this.setState({draggable: true});
    this.updateValue(event);
    document.addEventListener("mousemove", this.handleMouseMove.bind(this));
    document.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  handleMouseUp(event) {
    this.setState({draggable: false});
    document.removeEventListener("mousemove", this.handleMouseMove.bind(this));
    document.removeEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  handleMouseMove(event) {
    if (!this.state.draggable)
      return;
    this.updateValue(event);
  }

  updateValue(event) {
    let content = ReactDOM.findDOMNode(this);
    if (content instanceof HTMLElement) {
      let rect = content.getElementsByClassName("grey-bar")[0].getBoundingClientRect();
      let value = (event.clientX - rect.left) / (rect.right - rect.left) * (this.props.to - this.props.from) + this.props.from;
      let clippedValue = Math.round(clamp(value, this.props.from, this.props.to) / this.state.step) * this.state.step;
      this.props.setValue(clippedValue);
    }
  }

  render() {
    let width = !this.props.value || this.props.value == "" ? 0 :
    (clamp(this.props.value, this.props.from, this.props.to) - this.props.from) / (this.props.to - this.props.from);
    let lineWidth = "calc(9px + (100% - 18px) * " + width + ")";
    let dotOffset = "calc((100% - 18px) * " + width + ")";

    return (
      <div className="slider">
        <div className="row">
          <small className="left">{this.props.from}</small>
          <small className="right">{this.props.to}</small>
        </div>
        <div className="bar-row">
          <div
            className="grey-bar"
            onMouseDown={(event) => this.handleMouseDown(event)}
          >
            <div
              className="blue-bar"
              onMouseDown={(event) => this.handleMouseDown(event)}
              style={{width: lineWidth}}
            />
          </div>
          <div
            className="dot"
            onMouseDown={(event) => this.handleMouseDown(event)}
            style={{left: dotOffset}}
          />
        </div>
      </div>
    );
  }
}

export default Slider;

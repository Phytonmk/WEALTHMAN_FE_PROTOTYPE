import React, { Component } from 'react';
import ReactDOM from "react-dom";

import { clamp, roundAccurate } from './../helpers';

import '../../css/Slider.sass';

{/*
  //  //  //              USAGE EXAMPLE              //  //  //

  <Slider
    //(REQUIRED) value to show
    value={this.props.value}
    //(REQUIRED) function that sets the value
    setValue={this.props.setValue}
    //(REQUIRED) minimum value
    from={0}
    //(REQUIRED) maximum value
    to={100}
    //(OPTIONAL) minimum value change (default 1)
    step={1}
    //(OPTIONAL) units to show in tooltip
    units={"years"}
    //(OPTIONAL) ranges with different steps and labels
    ranges={[
      {
        //(REQUIRED) values range length
        length: 20,
        //(OPTIONAL) range step (default is step of slider)
        step: 1,
        //(OPTIONAL) label for the range end
        label: "1-20"
      },
      {
        length: 30,
        step: 2,
        label: "20-50"
      },
    ]}
  />
*/}

class Slider extends Component {
  constructor(props) {
    super(props);
    let step;
    if (this.props.ranges && this.props.ranges.length > 0 && this.props.ranges[0].step)
      step = this.props.ranges[0].step;
    else
      step = this.props.step || 1;
    this.state = {
      draggable: false,
      step: step,
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
      let value = (event.clientX - rect.left) / (rect.right - rect.left);
      value = clamp(value, 0, 1);
      let from, to, step;

      if (this.props.ranges) {
        let rangeIndex = Math.floor(value * this.props.ranges.length);
        let range = this.props.ranges[rangeIndex];
        step = range.step && this.state.step;
        from = this.props.ranges
        .slice(0, rangeIndex)
        .map(range => range.length)
        .reduce((a, b) => a + b);
        to = from + range.length;
      } else {
        step = this.state.step;
        from = this.props.from;
        to = this.props.to;
      }

      this.setState({step: step});
      value = value * (to - from) + from;
      value = roundAccurate(value, step);
      value = clamp(value, from, to);
      this.props.setValue(value);
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
            className={"dot " + (this.state.draggable && "active")}
            onMouseDown={(event) => this.handleMouseDown(event)}
            style={{left: dotOffset}}
          >
            <div className="tooltip noselect">
              {this.props.value || this.props.from} {this.props.units}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Slider;

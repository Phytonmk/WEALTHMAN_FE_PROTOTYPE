import React, { Component } from 'react';
import ReactDOM from "react-dom";

import { clamp, roundAccurate } from './../helpers';

import '../../css/Slider.sass';

{/*
  //  //  //              USAGE EXAMPLE              //  //  //

  <Slider
    //(REQUIRED) value to show
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
    let step = this.props.step || 1;
    let state = {
      draggable: false,
      position: 0,
    };
    
    if (this.props.ranges) {
      let lastIncludedRangeIndex = -1;
      let rangeFrom = this.props.from;
      for (let i = 0; i < this.props.ranges.length; i++) {
        if (rangeFrom >= this.props.to) {
          lastIncludedRangeIndex = i - 1;
          break;
        }
        rangeFrom += this.props.ranges[i].length;
      }
      if (lastIncludedRangeIndex = -1)
        state.ranges = this.props.ranges;
      else
        state.ranges = this.props.ranges.slice(lastIncludedRangeIndex);
      if (lastIncludedRangeIndex < this.props.ranges.length)
        step = this.props.ranges[lastIncludedRangeIndex + 1].step || step;
    }

    state.step = step;
    this.state = state;
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
      let position = (event.clientX - rect.left) / (rect.right - rect.left);
      position = clamp(position, 0, 1);
      let from, to, step;

      if (this.state.ranges) {
        let rangeIndex = Math.floor(position * this.state.ranges.length);
        let range = this.state.ranges[rangeIndex];
        step = range.step ? range.step : this.state.step;
        if (rangeIndex == 0)
          from = this.props.from;
        else
          from = this.props.from + this.state.ranges
          .slice(0, rangeIndex)
          .map(range => range.length)
          .reduce((a, b) => a + b);
        to = from + range.length;
      } else {
        step = this.state.step;
        from = this.props.from;
        to = this.props.to;
      }

      this.setState({
        step: step,
        position: position,
      });
      let value = from + roundAccurate(position * (to - from), step);
      value = clamp(value, from, to);
      this.props.setValue(value);
    }
  }

  render() {
    let width = this.state.position;
    let lineWidth = "calc(9px + (100% - 18px) * " + width + ")";
    let sliderThumbOffset = "calc((100% - 18px) * " + width + ")";

    let rangePoints;
    if (this.state.ranges) {
      rangePoints = [
        <div className="point passed" style={{left: 0}} />,
        ...this.state.ranges.map((range, index) => {
          let left = ((index + 1) / this.state.ranges.length);
          return <div
            className={"point " + (left < this.state.position && "passed")}
            style={{left: "calc((100% - 12px) * " + left + ")"}}
          >
            <small className="noselect">{range.label}</small>
          </div>;
        }),
        <div className="point" style={{right: 0}} />,
      ];
    }

    return (
      <div className="slider">
        <div className="row">
          <small className="left">{this.props.fromLabel ? this.props.fromLabel : this.props.from}</small>
          <small className="right">{this.props.toLabel ? this.props.toLabel : this.props.to}</small>
        </div>
        <div className="bar-row">
          <div
            className="grey-bar"
            onMouseDown={(event) => this.handleMouseDown(event)}
          >
            {rangePoints}
            <div
              className="blue-bar"
              onMouseDown={(event) => this.handleMouseDown(event)}
              style={{width: lineWidth}}
            />
          </div>
          <div
            className={"slider-thumb " + (this.state.draggable && "active")}
            onMouseDown={(event) => this.handleMouseDown(event)}
            style={{left: sliderThumbOffset}}
          >
            <div className="tooltip noselect">
              {this.props.valueLabel || this.props.value || this.props.from}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Slider;

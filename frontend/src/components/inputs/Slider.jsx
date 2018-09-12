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
    };
    
    if (this.props.ranges) {
      let lastIncludedRangeIndex = -1;
      let rangeTo = this.props.from;
      for (let i = 0; i < this.props.ranges.length; i++) {
        rangeTo += this.props.ranges[i].length;
        if (rangeTo > this.props.to) {
          lastIncludedRangeIndex = i;
          break;
        }
      }
      if (lastIncludedRangeIndex == -1)
        state.ranges = this.props.ranges;
      else
        state.ranges = this.props.ranges.slice(0, lastIncludedRangeIndex);
      if (lastIncludedRangeIndex < this.props.ranges.length - 1)
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
      let from, to, step, value;

      if (this.state.ranges) {
        var rangeIndex = Math.floor(position * this.state.ranges.length);
        let range = this.state.ranges[rangeIndex];
        step = range.step ? range.step : this.state.step;
        step /= 10;
        if (rangeIndex == 0)
          from = this.props.from;
        else
          from = this.props.from + this.state.ranges
          .slice(0, rangeIndex)
          .map(range => range.length)
          .reduce((a, b) => a + b);
        to = from + range.length;
        position -= rangeIndex / this.state.ranges.length;
        position *= this.state.ranges.length;
        this.setState({
          position: rangeIndex / this.state.ranges.length + roundAccurate(position * (to - from), step) / (to - from) / this.state.ranges.length
        });
      } else {
        step = this.state.step;
        from = this.props.from;
        to = this.props.to;
      }

      this.setState({step: step});
      value = from + roundAccurate(position * (to - from), step);
      value = clamp(value, from, to);
      this.props.setValue(value);
    }
  }

  render() {
    let position;
    let value = clamp(this.props.value || this.props.from, this.props.from, this.props.to);
    if (this.state.ranges) {
      let rangeIndex = 0;
      let rangeFrom = this.props.from;
      for (let i = 0; i < this.state.ranges.length; i++) {
        if (value >= rangeFrom && value <= rangeFrom + this.state.ranges[i].length) {
          rangeIndex = i;
          break;
        }
        rangeFrom += this.state.ranges[i].length;
      }
      position = (rangeIndex + (value - rangeFrom) / this.state.ranges[rangeIndex].length) / this.state.ranges.length;
      position = clamp(position, 0, 1);
    }
    else
      position = (value - this.props.from) / (this.props.to - this.props.from);

    let lineWidth = "calc(9px + (100% - 18px) * " + position + ")";
    let sliderThumbOffset = "calc((100% - 18px) * " + position + ")";

    let rangePoints;
    if (this.state.ranges) {
      rangePoints = [
        <div className="point passed" style={{left: 0}} />,
        ...this.state.ranges.map((range, index) => {
          let left = ((index + 1) / this.state.ranges.length);
          return <div
            className={"point " + (left < position && "passed")}
            style={{left: "calc((100% - 12px) * " + left + ")"}}
          >
            {(index < this.state.ranges.length - 1) && <small className="noselect">{range.label}</small>}
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

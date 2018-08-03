import React, { Component } from 'react';
import ReactDOM from "react-dom";

import { clamp } from './helpers';
import TextInput from './TextInput';

import '../css/Slider.sass';

class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draggable: false,
      value: props.value,
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
      this.setState({value: clippedValue});
    }
  }

  render() {
    let width = !this.props.value || this.props.value == "" ? 0 :
    (clamp(this.props.value, this.props.from, this.props.to) - this.props.from) / (this.props.to - this.props.from);
    let lineWidth = "calc(9px + (100% - 18px) * " + width + ")";
    let dotOffset = "calc((100% - 18px) * " + width + ")";

    return (
      <div className="slider">
        <div className="input-column">
          <div className="row">
            <small>Age</small>
          </div>
          <TextInput
            value={this.state.value}
            setValue={(value) => {
              let number = value.replace(/[^0-9]/g, '');

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
        <div className="bar-column">
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
          <small>Adjust slider or enter a value</small>
        </div>
      </div>
    );
  }
}

export default Slider;

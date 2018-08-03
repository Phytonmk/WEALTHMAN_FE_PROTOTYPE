import React, { Component } from 'react';

import TextInput from './TextInput';
import Radio from './Radio';
import Slider from './Slider';

import '../css/Question.sass';

class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  renderInput() {
    switch(this.props.type) {
      case "text":
        return this.renderText();
      case "radio":
        return this.renderRadio();
      case "slider":
        return this.renderSlider();
    }
  }

  renderText() {
    return (
      <TextInput
        value={this.props.value}
        setValue={this.props.setValue}
      />
    );
  }
  renderRadio() {
    return (
      <Radio
        value={this.props.value}
        setValue={this.props.setValue}
        options={this.props.typeSpecific.answers}
      />
    );
  }
  renderSlider() {
    return (
      <Slider
        value={this.props.value}
        setValue={this.props.setValue}
        from={this.props.typeSpecific.from}
        to={this.props.typeSpecific.to}
        initial={this.props.typeSpecific.initial}
        step={this.props.typeSpecific.step}
      />
    );
  }

  render() {
    return (
      <div className="question">
        <h1>{this.props.title}</h1>
        <h3 className="grey">{this.props.description}</h3>
        {this.renderInput()}
      </div>
    );
  }
}

export default Question;

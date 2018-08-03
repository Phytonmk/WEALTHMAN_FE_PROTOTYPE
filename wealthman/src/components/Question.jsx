import React, { Component } from 'react';

import TextInput from './TextInput';
import Textarea from './Textarea';
import Radio from './Radio';
import Checkboxes from './Checkboxes';
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
      case "textarea":
        return this.renderTextarea();
      case "radio":
        return this.renderRadio();
      case "checkboxes":
        return this.renderCheckboxes();
      case "slider":
        return this.renderSlider();
    }
  }

  renderText() {
    return (
      <TextInput
        value={this.props.value}
        setValue={this.props.setValue}
        placeholder={this.props.typeSpecific.placeholder}
      />
    );
  }
  renderTextarea() {
    return (
      <Textarea
        value={this.props.value}
        setValue={this.props.setValue}
        placeholder={this.props.typeSpecific.placeholder}
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
  renderCheckboxes() {
    return (
      <Checkboxes
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
        step={this.props.typeSpecific.step}
      />
    );
  }

  render() {
    return (
      <div className="question">
        <h1>{this.props.title}</h1>
        <h3>{this.props.description}</h3>
        {this.renderInput()}
      </div>
    );
  }
}

export default Question;

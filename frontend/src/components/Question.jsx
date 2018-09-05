import React, { Component } from 'react';

import Input from './Input';
import Textarea from './Textarea';
import Radio from './Radio';
import Checkboxes from './Checkboxes';
import Slider from './Slider';
import AgeSlider from './AgeSlider';

import '../css/Question.sass';

{/*
  //  //  //              USAGE EXAMPLE              //  //  //

<Question
  //(REQUIRED) value for the answer
  value={this.state.value}
  //(REQUIRED) function that sets the value
  setValue={value => this.setState({value: value})}
  //(OPTIONAL) question itself
  title={"How long do you live?"}
  //(OPTIONAL) small description for the question
  description={"please answer"}
  //(REQUIRED) type of the question form (can be "text", "textarea", "radio", "checkboxes", "slider", "age-slider")
  type={"age-slider"}
  //(REQUIRED) specific props for this question type (see what props required for selected question type)
  typeSpecific={
    from: 18,
    to: 100,
    step: 1,
  }
/>
*/}

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
      case "age-slider":
        return this.renderAgeSlider();
    }
  }

  renderText() {
    return (
      <Input
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
  renderAgeSlider() {
    return (
      <AgeSlider
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

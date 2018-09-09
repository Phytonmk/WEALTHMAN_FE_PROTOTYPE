import React, { Component } from 'react';

import Input from './inputs/Input';
import Textarea from './inputs/Textarea';
import Radio from './inputs/Radio';
import Checkboxes from './inputs/Checkboxes';
import Slider from './inputs/Slider';
import SliderWithInput from './inputs/SliderWithInput';

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
      case "cost-slider":
        return this.renderCostSlider();
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
      <SliderWithInput
        value={this.props.value}
        setValue={this.props.setValue}
        from={this.props.typeSpecific.from}
        to={this.props.typeSpecific.to}
        step={this.props.typeSpecific.step}
        units="years"
        inputLabel="Age"
      />
    );
  }
  renderCostSlider() {
    return (
      <SliderWithInput
        value={this.props.value}
        setValue={this.props.setValue}
        from={this.props.typeSpecific.from}
        to={this.props.typeSpecific.to}
        step={this.props.typeSpecific.step}
        units="$"
        inputLabel="Cost, usd"
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

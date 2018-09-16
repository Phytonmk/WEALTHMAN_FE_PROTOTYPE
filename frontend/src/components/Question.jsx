import React, { Component } from 'react'
import Input from './inputs/Input';
import Textarea from './inputs/Textarea';
import Radio from './inputs/Radio';
import Checkbox from './inputs/Checkbox';
import Slider from './inputs/Slider';
import SliderWithInput from './inputs/SliderWithInput';

import '../css/Question.sass'
import { niceNumber2 } from './helpers'

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
    super(props)
    this.state = {
    }
  }

  renderInput() {
    switch(this.props.type) {
      case 'text':
        return this.renderText()
      case 'textarea':
        return this.renderTextarea()
      case 'radio':
        return this.renderRadio()
      case 'checkboxes':
        return this.renderCheckboxes()
      case 'slider':
        return this.renderSlider()
      case 'age-slider':
        return this.renderAgeSlider()
      case 'cost-slider':
        return this.renderCostSlider()
      case 'range-slider':
        return this.renderRangeSlider()
      default:
        return <p>Unable to render {this.props.type} input</p>
    }
  }

  renderText() {
    return (
      <Input
        value={this.props.value}
        setValue={this.props.setValue}
        placeholder={this.props.typeSpecific.placeholder}
      />
    )
  }
  renderTextarea() {
    return (
      <Textarea
        value={this.props.value}
        setValue={this.props.setValue}
        placeholder={this.props.typeSpecific.placeholder}
      />
    )
  }
  renderRadio() {
    return (
      <Radio
        value={this.props.value}
        setValue={this.props.setValue}
        options={this.props.typeSpecific.answers}
      />
    )
  }
  renderCheckboxes() {
    return (
      <Checkbox
        value={this.props.value}
        setValue={this.props.setValue}
        options={this.props.typeSpecific.answers}
      />
    )
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
    )
  }
  renderAgeSlider() {
    return (
      <div className="short-slider-column">
        <SliderWithInput
          value={this.props.value}
          setValue={this.props.setValue}
          from={this.props.typeSpecific.from}
          to={this.props.typeSpecific.to}
          valueLabel={(this.props.value || "") + " years"}
          step={this.props.typeSpecific.step}
          inputLabel="Age"
        />
      </div>
    )
  }
  renderCostSlider() {
    return (
      <div className="short-slider-column">
        <SliderWithInput
          value={this.props.value}
          setValue={this.props.setValue}
          from={this.props.typeSpecific.from}
          to={this.props.typeSpecific.to}
          valueLabel={(this.props.value || "") + " $"}
          step={this.props.typeSpecific.step}
          inputLabel="Cost, usd"
        />
      </div>
    )
  }
  renderRangeSlider() {
    return (
      <SliderWithInput
        setValue={this.props.setValue}
        from={0}
        to={999999999}
        valueLabel={niceNumber2(this.props.value)}
        fromLabel={"0"}
        toLabel={"1b"}
        inputLabel="Cost, usd"
        ranges={[
          {
            length: 50000,
            label: "50k",
            step: 5000,
          },
          {
            length: 150000,
            label: "200k",
            step: 10000,
          },
          {
            length: 100000,
            label: "300k",
            step: 20000,
          },
          {
            length: 200000,
            label: "500k",
            step: 50000,
          },
          {
            length: 500000,
            label: "1m",
            step: 100000,
          },
          {
            length: 4000000,
            label: "5m",
            step: 800000,
          },
          {
            length: 5000000,
            label: "10m",
            step: 1000000,
          },
          {
            length: 40000000,
            label: "50m",
            step: 8000000,
          },
          {
            length: 50000000,
            label: "100m",
            step: 10000000,
          },
          {
            length: 400000000,
            label: "500m",
            step: 80000000,
          },
          {
            length: 499000000,
            label: "1b",
            step: 50000000,
          },
        ]}
      />
    )
  }
  render() {
    return (
      <div className="question">
        <div className="text">
          <h1>{this.props.title}</h1>
          <h3>{this.props.description}</h3>
        </div>
        <div className="row">
          {this.renderInput()}
        </div>
      </div>
    )
  }
}

export default Question

import React, { Component } from 'react';
import { setReduxState } from '../redux';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import { api, getCookie, setPage, previousPage } from './helpers';

export default class QuestionsForm extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      answers: [],
      question: 0,
      questionsStack: []
    };
  }

  radioAnswer(event) {
    const answers = [...this.state.answers];
    answers[this.state.question] = {
      question: this.props.questions[this.state.question].question,
      answer: event.target.id,
    };
    this.setState({answers});
    this.props.onChange(this.state.question, answers);
  }
  sliderAnswer(event) {
    const answers = [...this.state.answers];
    answers[this.state.question] = {
      question: this.props.questions[this.state.question].question,
      answer: event.target.value,
    };
    this.setState({answers});
    this.props.onChange(this.state.question, answers);
  }
  textAnswer(event, inputIndex) {
    const answers = [...this.state.answers];
    if (typeof answers[this.state.question] === 'undefined')
      answers[this.state.question] = [];
    answers[this.state.question][inputIndex] = {
      question: this.props.questions[this.state.question].question,
      answer: event.target.value,
    };
    this.setState({answers});
    this.props.onChange(this.state.question, answers);
  }
  prevQuestion() {
    const questionsStack = [...this.state.questionsStack];
    const question = questionsStack.pop();
    console.log(question, questionsStack);
    this.setState({question, questionsStack});
    this.props.onChange(this.state.question, this.state.answers);
  }
  nextQuestion() {
    if (this.state.answers[this.state.question] !== undefined) {
      for (let i = this.state.question + 1; i < this.props.questions.length; i++) {
        if (this.props.questions[i].condition(this.state.answers)) {
          const questionsStack = [...this.state.questionsStack];
          questionsStack.push(this.state.question);
          this.setState({question: i, questionsStack});
          console.log(questionsStack);
          this.props.onChange(this.state.question, this.state.answers);
          break;
        }
      }
    } else {
      alert('You haven\'t answered yer')
    }
  }
  complete() {
    if (this.state.answers[this.state.question] !== undefined) {
      this.props.onSubmit();
    } else {
      alert('You haven\'t answered yer')
    }
  }
  render() {
    let question;
    if (this.props.questions[this.state.question].answers)
      question = 
        <div>
          {this.props.questions[this.state.question].answers.map((answer, i) =>
            <div key={i} id={i} className="answer">
              <input
                 type="radio"
                 id={answer}
                 checked={this.state.answers[this.state.question] !== undefined && this.state.answers[this.state.question].answer === answer}
                 onChange={(event) => this.radioAnswer(event)} />
              <label htmlFor={answer}>{answer}</label>
            </div>)}
        </div>
    else if (this.props.questions[this.state.question].slider)
      question = 
        <div className="answer">
          <input
           type="range"
           from={this.props.questions[this.state.question].slider.from}
           step={this.props.questions[this.state.question].slider.step}
           to={this.props.questions[this.state.question].slider.to}
           value={this.state.answers[this.state.question] !== undefined ? this.state.answers[this.state.question].answer : this.props.questions[this.state.question].slider.to}
           onChange={(event) => this.sliderAnswer(event)}
           />
          <label>{this.state.answers[this.state.question] !== undefined ? this.state.answers[this.state.question].answer : this.props.questions[this.state.question].slider.to}</label>
          <br />
          {this.props.questions[this.state.question].subtitle ? <label>{this.props.questions[this.state.question].subtitle}</label> : ''}
        </div>
    else if (this.props.questions[this.state.question].inputs)
      question = <div>
          {this.props.questions[this.state.question].inputs.map((q, i) =>
            <div id={i} key={i} className="answer">
              <input
                 type="text"
                 value={this.state.answers[this.state.question] !== undefined && this.state.answers[this.state.question][i] !== undefined ? this.state.answers[this.state.question][i].answer : ''}
                 onChange={(event) => this.textAnswer(event, i)}
                 placeholder={q}
                  />
              <label>{q}</label>
            </div>)}
        </div>
    return (
      <div className="form-question">
        <h4>{this.props.questions[this.state.question].question}</h4>
        {question}
        <div className="row-padding">
          {
            this.state.question === 0 ?
            (<button className="back" onClick={() => previousPage()}>Back</button>) :
            (<button className="back" onClick={() => this.prevQuestion()}>Back</button>)
          }
          {
            this.props.questions[this.state.question].step === this.props.questions[this.state.question].total ?
            <button className="continue" onClick={() => this.complete()}>Complete form</button> :
            <button className="continue" onClick={() => this.nextQuestion()}>Next question</button>
          }
        </div>
      </div>
    );
  }
}
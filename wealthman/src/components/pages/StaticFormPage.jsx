import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import { api, getCookie, setPage, previousPage } from '../helpers';

import auth from '../auth.js';

import ProgressBar2 from '../ProgressBar2';

const questions = [
  {
    question: "What is your primary reason for investing?",
    subtitle: "Choose one goal and then add other goals from your personal account. ",
    answers: ["Long-term investment growth", "Emergency fund", "Retirement", "Large purchase (like education,  house,  business, etc) ", "Other"]
  },
  {
    question: "How old are you? ",
    subtitle: "Your answer will allow us to understand your investment timelines and build right plan.",
    slider: {
      from: 18,
      to: 100,
      step:1
    }
  },
  {
    question: "What age and length of retirement you plan?",
    inputs: ["Retirement age",  "Retirement length"]
  },
  {
    question: "How long do you plan to hold your investments in the markets?",
    answers: ["Short (Less than 3 years)", "Medium (3 to 8 years)", "Long (8 years or more)"]
  },
  {
    question: "What currency you measure your wealth?",
    answers: ["BTC","ETH","EUR","USD","GBP","CHF","RUB"]
  },
  {
    question: "What's your annual income?",
    answers: ["Under $25k","$25k - $50k","$51k - $100k","$101k - $300k","$301k - $1.2m","Over $1.2m"]
  },
  {
    question: "What is the size of your liquid assets?",
    subtitle:"Add up your checking, savings, investment portfolios, even the cash under your mattress - but exclude assets like your home or car. An estimate will work.",
    slider: {
      from: 0,
      to: 100,
      step: 5
    }
  },
  {
    question: "What is the value of other property you own?",
    subtitle: "Add up the value of your home, car, or other valuables you own. An estimate will work.",
    slider: {
      from: 0,
      to: 100,
      step: 5
    }
  },
  {
    question: "What about your debts?",
    subtitle: "Add up any mortgages, loans, leases or credit card debt. An estimate will work.",
    slider: {
      from: 0,
      to: 100,
      step: 5
    }
  },
  {
    question: "How long have you been an investor in the stock market?",
    answers: ["I've never invested in the stock market before","Less than 5 years","Between 5 and 10 years","More than 10 years"]
  },
  {
    question: "What would you do if your investment portfolio lost 10% of its value in a month during a global market decline?",
    answers: ["Buy more","Hold investments","Sell investments"]
  }
]


class StaticFormPage extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      question: 0,
      answers: []
    };
  }
  sendForm() {
    api.post('investor/risk', {answers: this.state.answers})
      .then((res) => {
        setReduxState({risk: res.data});
        setPage('investor register');
      })
      .catch(console.log);
  }
  radioAnswer(event) {
    const answers = [...this.state.answers];
    answers[this.state.question] = {
      question: questions[this.state.question].question,
      answer: event.target.id,
    };
    this.setState({answers});
  }
  sliderAnswer(event) {
    console.log(event.target.value);
    const answers = [...this.state.answers];
    answers[this.state.question] = {
      question: questions[this.state.question].question,
      answer: event.target.value,
    };
    this.setState({answers});
  }
  textAnswer(event, inputIndex) {
    const answers = [...this.state.answers];
    if (typeof answers[this.state.question] === 'undefined')
      answers[this.state.question] = [];
    answers[this.state.question][inputIndex] = {
      question: questions[this.state.question].question,
      answer: event.target.value,
    };
    this.setState({answers});
  }
  render() {
    // console.log(this.state.answers);
    let question;
    if (questions[this.state.question].answers)
      question = 
        <div>
          {questions[this.state.question].answers.map((answer, i) =>
            <div key={i} id={i} className="answer">
              <input
                 type="radio"
                 id={answer}
                 checked={this.state.answers[this.state.question] !== undefined && this.state.answers[this.state.question].answer === answer}
                 onChange={(event) => this.radioAnswer(event)} />
              <label htmlFor={answer}>{answer}</label>
            </div>)}
        </div>
    else if (questions[this.state.question].slider)
      question = 
        <div className="answer">
          <input
           type="range"
           from={questions[this.state.question].slider.from}
           step={questions[this.state.question].slider.step}
           to={questions[this.state.question].slider.to}
           value={this.state.answers[this.state.question] !== undefined ? this.state.answers[this.state.question].answer : questions[this.state.question].slider.to}
           onChange={(event) => this.sliderAnswer(event)}
           />
          <label>{this.state.answers[this.state.question] !== undefined ? this.state.answers[this.state.question].answer : questions[this.state.question].slider.to}</label>
          <br />
          {questions[this.state.question].subtitle ? <label>{questions[this.state.question].subtitle}</label> : ''}
        </div>
    else if (questions[this.state.question].inputs)
      question = <div>
          {questions[this.state.question].inputs.map((q, i) =>
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
    var form =
      (<div className="form-question">
        <h4>{questions[this.state.question].question}</h4>
        {question}
      </div>
    );

    return (
      <div>
        {/* {this.renderBackButton()} */}
        <ProgressBar2 step={this.state.question} total={questions.length}/>
        <div className="container">
          <div className="box">
            <div className="container">
              <h2>Risk Tolerance Profile Questions</h2>
              <h4 className="grey">Asked once</h4>
              {form}
              <div className="row-padding">
                {
                  this.state.question === 0 ?
                  (<button className="back" onClick={() => previousPage()}>Back</button>) :
                  (<button className="back" onClick={() => this.setState({question: this.state.question - 1})}>Back</button>)
                }
                {
                  this.state.question === questions.length - 1 ?
                  <button className="continue" onClick={() => this.sendForm()}>Complete form</button> :
                  <button className="continue" onClick={() => this.setState({question: this.state.question + 1})}>Next question</button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(a => a)(StaticFormPage)
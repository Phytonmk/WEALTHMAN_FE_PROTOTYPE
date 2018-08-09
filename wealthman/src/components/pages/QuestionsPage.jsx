import React, { Component } from 'react';

import ProgressBar3 from './../ProgressBar3';
import Question from './../Question';
import { camelize, dasherize } from './../helpers';

class QuestionsPage extends Component {
  constructor(props) {
    super(props);

    const questions = [
      {
        question: "What is your current age?",
        type: "age-slider",
        typeSpecific: {
          from: 18,
          to: 100,
        }
      },
      {
        question: "What of the following best describes your household?",
        type: "radio",
        typeSpecific: {
          answers: ["Single income, no dependents", "Single income, at least one dependent", "Dual income, no dependents", "Dual income, at least one dependent", "Retired or financially independent"]
        }
      },
      {
        question: "What is your primary reason for investing?",
        type: "radio",
        typeSpecific: {
          answers: ["General Savings", "Retirement", "Colledge savings", "Other"]
        }
      },
      {
        question: "What is your annual income?",
        type: "radio",
        typeSpecific: {
          answers: ["Under $25k", "$25k - $50k", "$51k - $100k", "$101k - $300k", "$301k - $1.2m", "Over $1.2m"]
        }
      },
      {
        question: "What is the size of your liquid assets?",
        description: "Add up your assets from checking, savings accounts, investment portfolios, even the cash under your mattress - but exclude assets, like your home or car. An estimate will work.",
        type: "slider",
        typeSpecific: {
          from: 0,
          to: 999999999,
        }
      },
      {
        question: "What is the value of other property you own?",
        description: "Add up the value of your home, car, or other valuables you own. An estimate will work.",
        type: "slider",
        typeSpecific: {
          from: 0,
          to: 999999999,
        }
      },
      {
        question: "What about your debts?",
        description: "Add up any mortgages, loans, leases or credit card debt. An estimate will work.",
        type: "slider",
        typeSpecific: {
          from: 0,
          to: 999999999,
        }
      },
      {
        question: "What is the total amount of money you want to invest?",
        type: "radio",
        typeSpecific: {
          answers: ["100-500$", "501-1000$", "1001-5000$", "5001-10000$", "10001-100000$", "100001$ or more"]
        }
      },
      {
        question: "How long have you been an investor in the stock market?",
        type: "radio",
        typeSpecific: {
          answers: ["I've never invested in the stock market before", "Less than 5 years", "Between 5 and 10 years", "More than 10 years"]
        }
      },
      {
        question: "When deciding how to invest your money, wich do you care about more?",
        type: "radio",
        typeSpecific: {
          answers: ["Maximizing gains", "Minimizing looses", "Both equally"]
        }
      },
      {
        question: "The global stock market is often volatile. If your entire investement portfolio lost 10% of its value in a month during a market decline, what would you do?",
        type: "radio",
        typeSpecific: {
          answers: ["Buy more", "Hold investments", "Sell investments"]
        }
      },
    ];

    let stateObj = {};
    stateObj["questions"] = questions;
    questions.forEach(question => stateObj[camelize(question.question)] = "");
    this.state = stateObj;
  }
  render() {
    let questionsToPages = this.state.questions.map(question => {
      return {
        link: dasherize(question.question),
        allowContinue: this.state[camelize(question.question)] != "",
        component: <Question
          value={typeof this.state[camelize(question.question)] == "undefined" ? "" : this.state[camelize(question.question)]}
          setValue={(value) => {this.setState({[camelize(question.question)]: value})}}
          title={question.question}
          description={question.description}
          type={question.type}
          typeSpecific={question.typeSpecific}
        />
      };
    });
    return (
      <div id="questions-page">
        <ProgressBar3
          match = {this.props.match}
          finishLink = "/user-agreement"
          approxLength={8}
          pages={questionsToPages}
        />
      </div>
    );
  }
}

export default QuestionsPage

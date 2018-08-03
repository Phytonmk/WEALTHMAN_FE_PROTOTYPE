import React, { Component } from 'react';

import ProgressBar3 from './../ProgressBar3';
import Question from './../Question';
import { dasherize } from './../helpers';

class QuestionsPage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let questions = [
      {
        question: "What is your current age?",
        type: "slider",
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
        question: "What is your annual pre-tax income?",
        type: "radio",
        typeSpecific: {
          answers: ["100-500$", "501-1000$", "1001-5000$", "5001-10000$", "10001-100000$", "100001$ or more"]
        }
      },
      {
        question: "What is the total value of your cash in liquid investments?",
        type: "radio",
        typeSpecific: {
          answers: ["100-500$", "501-1000$", "1001-5000$", "5001-10000$", "10001-100000$", "100001$ or more"]
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
          answers: ["Sell all of your investments", "Sell some", "Keep all", "Buy more"]
        }
      },
    ];
    let questionsToPages = questions.map(question => {
      return {
        link: dasherize(question.question),
        component: <Question
          value={"A"}
          setValue={() => {}}
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
          finishLink = "/contact"
          approxLength={10}
          pages={questionsToPages}
        />
      </div>
    );
  }
}

export default QuestionsPage

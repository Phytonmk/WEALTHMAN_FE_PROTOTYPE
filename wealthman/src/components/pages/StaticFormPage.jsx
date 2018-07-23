import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import { api, getCookie, setPage, previousPage } from '../helpers';

import auth from '../auth.js';

import ProgressBar2 from '../ProgressBar2';
import QuestionsForm from '../QuestionsForm';

const questions = [
  {
    question: 'What is your primary reason for investing?',
    subtitle: 'Choose one goal and then add other goals from your personal account. ',
    answers: ['Long-term investment growth', 'Emergency fund', 'Retirement', 'Large purchase (like education,  house,  business, etc)', 'Other'],
    step: 1,
    total: 4,
    condition: () => true
  },
  {
    question: 'How long do you plan to hold your investments in the markets?',
    inputs: ['Years'],
    condition: (answers) => answers[0] !== undefined && ['Long-term investment growth', 'Emergency fund', 'Other'].includes(answers[0].answer),
    step: 2,
    total: 4
  },
  {
    question: 'What is the total amount you want to invest?',
    inputs: ['$'],
    condition: (answers) => answers[0] !== undefined && ['Long-term investment growth', 'Emergency fund', 'Other'].includes(answers[0].answer),
    step: 3,
    total: 4
  },
  {
    question: 'What age and length of retirement you want to save?',
    inputs: ['Age', 'Length'],
    condition: (answers) => answers[0] !== undefined && answers[0].answer === 'Retirement',
    step: 2,
    total: 4
  },
  {
    question: 'What is the total amount you want to save?',
    inputs: ['$'],
    condition: (answers) => answers[0] !== undefined && answers[0].answer === 'Retirement',
    step: 3,
    total: 4
  },
  {
    question: 'What are the current value and expected time of your purchase?',
    inputs: ['Value', 'Expected time'],
    condition: (answers) => answers[0] !== undefined && answers[0].answer === 'Large purchase (like education,  house,  business, etc)',
    step: 2,
    total: 3
  },
  {
    question: 'What currency of your purchase?',
    answers: ['BTC','ETH','EUR','USD','GBP','CHF','RUB'],
    condition: (answers) => answers[0] !== undefined && answers[0].answer === 'Large purchase (like education,  house,  business, etc)',
    step: 3,
    total: 3
  },
  {
    question: 'What currency you measure your wealth?',
    answers: ['BTC','ETH','EUR','USD','GBP','CHF','RUB'],
    condition: (answers) => answers[0] !== undefined && answers[0].answer !== 'Large purchase (like education,  house,  business, etc)',
    step: 4,
    total: 4
  },
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
  render() {
    // console.log(this.state.answers);

    return (
      <div>
        {/* {this.renderBackButton()} */}
        <ProgressBar2 step={questions[this.state.question].step} total={questions[this.state.question].total}/>
        <div className="container">
          <div className="box">
            <div className="container">
              <h2>Risk Tolerance Profile Questions</h2>
              <h4 className="grey">Asked once</h4>
              <QuestionsForm 
                questions={questions}
                question={this.state.question}
                onChange={(question, answers) => this.setState({question, answers})}
                onNextQuestion={(questionId) => this.setState({question: questionId})}
                onSubmit={() => this.sendForm()}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(a => a)(StaticFormPage)
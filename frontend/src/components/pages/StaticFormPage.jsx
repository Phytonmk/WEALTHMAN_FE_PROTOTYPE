import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import { api, getCookie, setPage, previousPage } from '../helpers';

import auth from '../auth.js';

import ProgressBar2 from '../ProgressBar2';
import QuestionsForm from '../QuestionsForm';


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
        console.log('sent!!');
        setReduxState({risk: '1'});
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



const questions = [
  {
    question: 'How old are you?',
    inputs: [''],
    step: 1,
    total: 9,
    condition: () => true
  },
  {
    question: 'What is your annual pre-tax income?',
    inputs: [''],
    step: 2,
    total: 9,
    condition: () => true
  },
  {
    question: 'What is the size of your liquid assets?',
    inputs: [''],
    step: 3,
    total: 9,
    condition: () => true
  },
  {
    question: 'What is the value of other property you own?',
    inputs: [''],
    step: 4,
    total: 9,
    condition: () => true
  },
  {
    question: 'What about your debts?',
    inputs: [''],
    step: 5,
    total: 9,
    condition: () => true
  },
  {
    question: 'How long have you been investor in the stock market?',
    inputs: [''],
    step: 6,
    total: 9,
    condition: () => true
  },
  {
    question: 'What would you do if your investment portfolio lost 10% of its value in a month during a global market decline?',
    inputs: [''],
    step: 7,
    total: 9,
    condition: () => true
  },
  {
    question: 'When deciding how to invest your money, which do you care about more?',
    inputs: [''],
    step: 8,
    total: 9,
    condition: () => true
  },
  {
    question: 'What of the following best describes your household?',
    inputs: [''],
    step: 9,
    total: 9,
    condition: () => true
  },
]
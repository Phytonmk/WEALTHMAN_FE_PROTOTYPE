import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import ProgressBar3 from './../ProgressBar3'
import Question from './../Question'
import { camelize, dasherize } from './../helpers'

class KYCQuestionsPage extends Component {
  constructor(props) {
    super(props)
    let stateObj = {}
    questions.forEach(question => stateObj[camelize(question.question)] = '')
    this.state = stateObj
  }
  submitForm() {
    const answers = []
    for (let question of questions) {
      if (this.state[camelize(question.question)] !== '') {
        answers.push({
          question: question.question,
          answer: this.state[camelize(question.question)]
        })
      }
    }
    window.filledKYCanswers = answers
    // api.post('investor/kyc', {answers})
      // .then((res) => {
        // setReduxState({risk: res.data});
      // })
      // .catch(console.log);
  }
  render() {
    // console.log(this.props.history.location.search)
    const currentQuestions = questions.filter(question => typeof question.filter === 'function' ? question.filter(this.state) : true)
    // console.log(this.state)
    let questionsToPages = currentQuestions.map(question => {
      return {
        link: dasherize(question.question) + this.props.history.location.search,
        allowContinue: this.state[camelize(question.question)] != '',
        component: <Question
          value={typeof this.state[camelize(question.question)] == 'undefined' ? '' : this.state[camelize(question.question)]}
          setValue={(value) => {this.setState({[camelize(question.question)]: value})}}
          title={question.question}
          description={question.description}
          type={question.type}
          typeSpecific={question.typeSpecific}
          allAnswers={this.state}
        />
      }
    })
    return (
      <div id='questions-page'>
        <ProgressBar3
          match = {this.props.match}
          finishLink = {'/kyc' + this.props.history.location.search} 
          onComplete = {() => this.submitForm()}
          pages={questionsToPages}
        />
      </div>
          // approxLength={5}
    )
  }
}

const questions = [
  {
    question: 'What is your primary reason for investing?',
    type: 'radio',
    description: 'Choose one goal and then add other goals from your personal account.',
    typeSpecific: {
      answers: ['Long-term investment growth', 'Emergency fund', 'Retirement', 'Large purchase (education,  house,  business, etc)', 'Other']
    }
  },
  {
    question: 'How long do you plan to hold your investments in the markets?',
    type: 'age-slider',
    typeSpecific: {
      from: 0,
      to: 100,
    },
    filter: (state) => ['Long-term investment growth', 'Emergency fund', 'Other'].includes(state[camelize(questions[0].question)])
  },
  {
    question: 'What is the total amount you want to invest?',
    type: 'range-slider',
    typeSpecific: {
      from: 0,
      to: 999999999,
    },
    filter: (state) => ['Long-term investment growth', 'Emergency fund', 'Other'].includes(state[camelize(questions[0].question)])
  },
  {
    question: 'What is your age?',
    type: 'age-slider',
    typeSpecific: {
      from: 18,
      to: 100,
    },
    filter: (state) => ['Retirement'].includes(state[camelize(questions[0].question)])
  },
  {
    question: 'At what age do you plan to retire and for how long?',
    type: 'retirement-graphic',
    typeSpecific: {
      from: 0,
      to: 100,
    },
    filter: (state) => ['Retirement'].includes(state[camelize(questions[0].question)])
  },
  {
    question: 'What is the total amount you want to save?',
    type: 'range-slider',
    typeSpecific: {
      from: 0,
      to: 999999999,
    },
    filter: (state) => ['Retirement'].includes(state[camelize(questions[0].question)])
  },
  {
    question: 'What are the current value of your purchase?',
    type: 'range-slider',
    typeSpecific: {
      from: 0,
      to: 999999999,
    },
    filter: (state) => ['Large purchase (education,  house,  business, etc)'].includes(state[camelize(questions[0].question)])
  },
  {
    question: 'What are the expected time of your purchase?',
    type: 'age-slider',
    typeSpecific: {
      from: 0,
      to: 100,
    },
    filter: (state) => ['Large purchase (education,  house,  business, etc)'].includes(state[camelize(questions[0].question)])
  },
  {
    question: 'What currency of your purchase?',
    type: 'radio',
    typeSpecific: {
      answers: ['BTC','ETH','EUR','USD','GBP','CHF','RUB']
    },
    filter: (state) => ['Large purchase (education,  house,  business, etc)'].includes(state[camelize(questions[0].question)])
  },
  {
    question: 'What currency you measure your wealth?',
    type: 'radio',
    typeSpecific: {
      answers: ['BTC','ETH','EUR','USD','GBP','CHF','RUB']
    },
    filter: (state) => !['Large purchase (education,  house,  business, etc)'].includes(state[camelize(questions[0].question)])
  },
]


export default withRouter(KYCQuestionsPage)
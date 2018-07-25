import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { api, setPage, setCurrency, previousPage, getCookie } from '../helpers';

const services = ['Robo-advisor', 'Discretionary', 'Advisory'];

import ProgressBar2 from '../ProgressBar2';
import QuestionsForm from '../QuestionsForm';

class KYCPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      analysis: false,
      manager_comment: false,
      value: '',
      comment: '',
      manager: '-',
      managerId: '',
      managerName: '-',
      service: '-',
      revisionsAmount: 0,
      question: 0,
      period: 1,
      answers: [],
      formComplited: false
    };
    if (this.props.match.params.manager === undefined) {
      let managerString = getCookie('selectedManager');
      this.props.match.params.manager = managerString.split('/')[0];
      this.props.match.params.id = managerString.split('/')[1];
    }
  }
  componentWillMount() {
    let manager = '';
    if (this.props.match.params.manager === 'manager')
      manager = 'manager';
    else if (this.props.match.params.manager === 'company')
      manager = 'company';
    this.setState({manager, service: (getCookie('service') || '')});
    api.get(manager + '/' + this.props.match.params.id)
      .then((res) => {
        console.log(res.data.name, res.data.surname)
        this.setState({
          managerName: (res.data.name || res.data.company_name || '') + ' ' + (res.data.surname || ''),
          managerId: res.data.id,
          managerData: res.data
        })
      })
  }
  sendForm() {
    this.setState({formComplited: true});
    // api.post('investor/kyc', {answers: this.state.answers})
    //   .then((res) => {
    //     setReduxState({risk: res.data});
    //   })
    //   .catch(console.log);
  }
  send() {
    api.post('request', {
      type: 'portfolio',
      [this.state.manager]: this.state.managerId,
      value: this.state.value,
      comment: this.state.comment,
      service: this.state.service,
      revisions_amount: this.state.revisionsAmount,
      period: this.state.period,
      options: {
        analysis: this.state.analysis,
        comment: this.state.manager_comment
      }})
      .then(() => {
        setPage('requests');
      })
      .catch(console.log);
  }
  render() {
    let managerConditions = '';
    if (services.includes(this.state.service) && this.state.managerData) {
      const currentService = this.state.managerData.services.find(service => service.type === services.indexOf(this.state.service));
      if (currentService) {
        managerConditions = <div className="row">
          <div className="row"><b>Exit fee</b>: {currentService.exit_fee} %</div>
          <div className="row"><b>Management fee</b>: {currentService.managment_fee} %</div>
          <div className="row"><b>Perfomance fee</b>: {currentService.perfomance_fee} %</div>
          <div className="row"><b>Front fee</b>: {currentService.front_fee} %</div>
          <div className="row"><b>Max recalculations</b>: {currentService.recalculation} days</div>
          <div className="row"><b>Min investments</b>: {currentService.min} $</div>
        </div>
      }
    }
    let pageContent;
    if (!this.state.formComplited)
      pageContent =
        <QuestionsForm 
          questions={questions}
          onChange={(question, answers) => this.setState({question, answers})}
          onNextQuestion={(questionId) => this.setState({question: questionId})}
          onSubmit={() => this.sendForm()}
        />
    else
      pageContent = 
        <div>
          <div className="row">
            <p>By clicking “Send to {this.state.manager}” button you send</p>
            <ol>
              <li> Request for portfolio balance to {this.state.manager} <b>{this.state.managerName}</b> and selected service: <b>{this.state.service}</b></li>
              <li> Your personal risk profile and information </li>
            </ol>
          </div>
          {managerConditions}
          <div className="row">
            <p>Before it is sent, please, specify your target investment volume: and mark the follow options to get deep understanding of manager`s strategy (takes more time to get return portfolio recommendation):</p>
          </div>
          <h3><b>Sending request to manager</b></h3>
          <div className="row">
            <p>Investment size</p>
          </div>
          <div className="row">
            <input type="number" value={this.state.value} min="0" step="0.1" onChange={(event) => this.setState({value: event.target.value})} /> ETH
          </div>
          <div className="row">
            <p>Investment period</p>
          </div>
          <div className="row">
            <input type="number" value={this.state.period} min="1" step="7" onChange={(event) => this.setState({period: event.target.value})} /> Days
          </div>

          {this.state.service === 'Robo-advisor' || this.state.service === '-' ? '' : <div>
            <div className="row">
              <p>Allowed revisions amount</p>
            </div>
            <div className="row">
              <input type="number" value={this.state.revisionsAmount} min="0" step="1" onChange={(event) => this.setState({revisionsAmount: event.target.value})} />
            </div>
          </div>}
          <div className="row">
            <p>Comment for manager</p>
            <p>In case you want get special conditions (e.g. lower fees by greate investments amount), leave a comment here</p>
          </div>
          <div className="row">
            <input type="text" value={this.state.comment} onChange={(event) => this.setState({comment: event.target.value})} />
          </div>
          <div className="row">
            <p><label><input type="checkbox" checked={this.state.analysis} onChange={(event) => this.setState({analysis: event.target.checked})} /> Analysis Neccesity</label></p>
          </div>
          <div className="row-padding">
            <p><label><input type="checkbox" checked={this.state.manager_comment} onChange={(event) => this.setState({manager_comment: event.target.checked})} /> Comment Neccesity</label></p>
          </div>
          <br />
          <div className="row-padding">
            <Link to={"/managers"}>
              <button className="back" onClick={() => previousPage()}>Back</button>
            </Link>
            <button className="continue" onClick={() => this.send()}>Send to {this.state.manager}</button>
          </div>
        </div>
    return(
      <div>
        {this.state.formComplited ?
          <ProgressBar2 step="1" total="1" /> :
          <ProgressBar2 step={questions[this.state.question].step} total={questions[this.state.question].total} />}
        <div className="container">
          <div className="box">
            <div className="row">
              <h2>Know Your Criminals</h2>
            </div>
            {pageContent}
          </div>
        </div>
      </div>
    );
  }
}


export default connect(a => a)(KYCPage);



const questions = [
  {
    question: 'What is your primary reason for investing?',
    subtitle: 'Choose one goal and then add other goals from your personal account. ',
    answers: ['Long-term investment growth', 'Emergency fund', 'Retirement', 'Large purchase (like education,  house,  business, etc)', 'Other'],
    step: 1,
    total: 5,
    condition: () => true
  },
  {
    question: 'How long do you plan to hold your investments in the markets?',
    inputs: ['Years'],
    condition: (answers) => answers[0] !== undefined && ['Long-term investment growth', 'Emergency fund', 'Other'].includes(answers[0].answer),
    step: 2,
    total: 5
  },
  {
    question: 'What is the total amount you want to invest?',
    inputs: ['$'],
    condition: (answers) => answers[0] !== undefined && ['Long-term investment growth', 'Emergency fund', 'Other'].includes(answers[0].answer),
    step: 3,
    total: 5
  },
  {
    question: 'What age and length of retirement you want to save?',
    inputs: ['Age', 'Length'],
    condition: (answers) => answers[0] !== undefined && answers[0].answer === 'Retirement',
    step: 2,
    total: 5
  },
  {
    question: 'What is the total amount you want to save?',
    inputs: ['$'],
    condition: (answers) => answers[0] !== undefined && answers[0].answer === 'Retirement',
    step: 3,
    total: 5
  },
  {
    question: 'What are the current value and expected time of your purchase?',
    inputs: ['Value', 'Expected time'],
    condition: (answers) => answers[0] !== undefined && answers[0].answer === 'Large purchase (like education,  house,  business, etc)',
    step: 2,
    total: 4
  },
  {
    question: 'What currency of your purchase?',
    answers: ['BTC','ETH','EUR','USD','GBP','CHF','RUB'],
    condition: (answers) => answers[0] !== undefined && answers[0].answer === 'Large purchase (like education,  house,  business, etc)',
    step: 3,
    total: 4
  },
  {
    question: 'What currency you measure your wealth?',
    answers: ['BTC','ETH','EUR','USD','GBP','CHF','RUB'],
    condition: (answers) => answers[0] !== undefined && answers[0].answer !== 'Large purchase (like education,  house,  business, etc)',
    step: 4,
    total: 5
  },
]
const filters = [
  {
    link: "Robo-advisor",
    description: "Invest on Autopilot",
  },
  {
    link: "Discretionary",
    description: "Get The Right Investment Manager For Your Wealth",
  },
  {
    link: "Advisory",
    description: "Find The Right Advisory Support For Your Own Decisions On Investment Management",
  },
];
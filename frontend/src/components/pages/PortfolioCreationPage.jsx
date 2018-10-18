import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable2 from '../Sortable2';
import LevDate from '../LevDate';
import { api, setPage, setCurrency, previousPage } from '../helpers';
import {default as RequestHeader} from '../dashboards/Person';
import {default as RequestDetails} from './RequestPage/Details';



class PortfolioCreationPage extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      selected: [],
      tokens: [],
      selectedNames: [],
      request: null,
      investor: null,
      page: 'select',
      inputData: {},
      activeExists: false,
      exit_fee: '',
      managment_fee: '',
      perfomance_fee: '',
      front_fee: '',
      max_deviation: '10',
      commissions_frequency: '7',
      initiatedByManager: false,
      value: '',
      period: '',
      comment: '',
    };
  }
  componentWillMount() {
    api.get('stocks')
      .then((res) => {
        const tokens = res.data.map((token, i) => { return {
          id: i,
          icon: <img src={token.token_img ? api.imgUrl(token.token_img) : ''} className="token-icon" />,
          name: token.title,
          hint: token.name,
          volume: token.volume,
          price: token.last_price,
          change_percent: token.change_percent,
          action: ''
        }});
        this.setState({tokens: tokens});
        setTimeout(() => this.updateButtons(), 0);
      })
       .catch(console.log)
    api.post('get-request/' + this.props.match.params.id)
      .then((res) => {
        this.setState({
          request: res.data.request,
          investor: res.data.investor,
          exit_fee: res.data.request.exit_fee,
          managment_fee: res.data.request.managment_fee,
          perfomance_fee: res.data.request.perfomance_fee,
          front_fee: res.data.request.front_fee,
          max_deviation: res.data.request.max_deviation,
          commissions_frequency: res.data.request.commissions_frequency,
        });
      })
      .catch((e) => {
        if (e.response && e.response.status === 404) {
          api.get('investor/' + this.props.match.params.id)
            .then((res) => {
              this.setState({
                initiatedByManager: true,
                investor: res.data,
                exit_fee: 12,
                managment_fee: 12,
                perfomance_fee: 12,
                front_fee: 12,
                max_deviation: 10,
                commissions_frequency: 7,
                request: {
                  status: 'not created'
                }
              })
            })
            .catch(() => console.log('fuck'))
        } else {
          console.log(e)
        }
      });
    api.post('portfolio/load-draft', {
      request: this.props.match.params.id,
    })
      .then((res) => {
        const selectedNames = [...this.state.selectedNames]
        const selected = [];
        const inputData = {};
        if (res.data.exists) {
          let i = 0;
          for (let token of res.data.portfolio.currencies) {
            selectedNames.push(token.currency)
            selected.push(Object.assign({}, this.state.tokens.find(a => a.name === token.currency)))
            inputData[token.currency] = {
              percent: token.percent,
              analysis: token.analysis,
              comments: token.comments,
            }
          }
          this.setState({selected, inputData, activeExists: res.data.activeExists, selectedNames});
          setTimeout(() => this.updateButtons(), 10);
        }
      })
      .catch(console.log);
  }
  updateButtons() {
    const state = Object.assign({}, this.state);
    state.tokens.map(token => {
      if (this.state.selectedNames.includes(token.name))
        token.action = <button style={{width: 100}} className="big-red-button" onClick={() => this.removeToken(token)}>Remove</button>
      else
        token.action = <button style={{width: 100}} className="big-blue-button" onClick={() => this.addToken(token)}>Add</button>
      return token;
    });
    this.setState(state);
  }
  removeToken(token) {
    const state = Object.assign({}, this.state);
    state.selected.splice(state.selectedNames.indexOf(token.name), 1);
    state.selectedNames.splice(state.selectedNames.indexOf(token.name), 1);
    delete state.inputData[token.name]
    this.setState(state);
    setTimeout(() => this.updateButtons(), 0);
  }
  addToken(token) {
    const state = Object.assign({}, this.state);
    let sumPercent = 0
    let tokensAmount = 1
    for (let token in state.inputData) {
      sumPercent += 1 * state.inputData[token].percent
      tokensAmount++
    }
    if (sumPercent === 0)
      sumPercent = 100
    const newPercent = Math.round(sumPercent / tokensAmount)
    for (let token in state.inputData) {
      state.inputData[token].percent -= Math.round(newPercent * (state.inputData[token].percent / sumPercent))
    }
    state.inputData[token.name] = {
      percent: newPercent,
      analysis: '',
      comments: '',
    };
    state.selected.push(Object.assign({}, token));
    state.selectedNames.push(token.name);
    this.setState(state);
    setTimeout(() => this.updateButtons(), 10);
  }
  changeTokenData(token, property, value) {
    const state = Object.assign({}, this.state);
    state.inputData[token][property] = value;
    this.setState(state);
    setTimeout(() => this.forceUpdate(), 0);
  }
  save(callback) {
    const currencies = [];
    for (let token in this.state.selected) {
      const tokenName = this.state.selected[token].name;
      currencies.push({
        currency: tokenName,
        last_price: this.state.selected[token].price,
        percent: this.state.inputData[tokenName].percent * 1,
        analysis: this.state.inputData[tokenName].analysis,
        comments: this.state.inputData[tokenName].comments,
      });
    }
    api.post('portfolio/save', {
      request: this.props.match.params.id,
      currencies,
      fees: {
        exit_fee: this.state.exit_fee,
        managment_fee: this.state.managment_fee,
        perfomance_fee: this.state.perfomance_fee,
        front_fee: this.state.front_fee,
      },
      max_deviation: this.state.max_deviation,
      commissions_frequency: this.state.commissions_frequency,
      value: this.state.value,
      period: this.state.period,
      comment: this.state.comment,
      investor: this.props.match.params.id
    })
      .then((res) => {
        if (typeof callback === 'function')
          callback(res.data);
        else
          setPage('requests');
      })
      .catch(console.log);

  }
  send() {
    this.save((requestId) => {
      api.post(`portfolio/${this.state.activeExists ? 'review' : 'propose'}/${requestId}`)
        .then(() => setPage('requests'))
        .catch(console.log);
    })
  }
  setFee(fee, value) {
    console.log(fee, value)
    const changingAvalible = this.state.request.status === 'pending' || this.state.request.status === 'not created'
    if (changingAvalible) {
      const request = Object.assign({}, this.state.request)
      request[fee] = value
      this.setState({
        request,
        [fee]: value
      })
    }
  }
  render() {
    let page = '';
    switch(this.state.page) {
      case 'fees':
        const changingAvalible = this.state.request.status === 'pending' || this.state.request.status === 'not created'
        page = <div>
          <div className="row">{changingAvalible ? 'Request is pending, so you can set custom fees, investor may accept or decline them' : 'Request is not pending, so you unable to change them'}</div>
          <div className="row">Exit fee:</div><div className="row"><input type="number" step="1" min="0" max="100" value={this.state.exit_fee} onChange={(event) => this.setFee('exit_fee', event.target.value)}/> %</div>
          <div className="row">Management fee:</div><div className="row"><input type="number" step="1" min="0" max="100" value={this.state.managment_fee} onChange={(event) => this.setFee('managment_fee', event.target.value)}/> %</div>
          <div className="row">Perfomance fee:</div><div className="row"><input type="number" step="1" min="0" max="100" value={this.state.perfomance_fee} onChange={(event) => this.setFee('perfomance_fee', event.target.value)}/> %</div>
          <div className="row">Front fee:</div><div className="row"><input type="number" step="1" min="0" max="100" value={this.state.front_fee} onChange={(event) => this.setFee('front_fee', event.target.value)}/> %</div>
          <br />
          <div className="row">Max deviation:</div><div className="row"><input type="number" step="1" min="0" max="100" value={this.state.max_deviation} onChange={(event) => this.setFee('max_deviation', event.target.value)}/> %</div>
          <div className="row">frequency of commission payments:</div><div className="row"><input type="number" step="5" min="0" value={this.state.commissions_frequency} onChange={(event) => this.setFee('commissions_frequency', event.target.value)}/> Days</div>
        </div>
      break;
      case 'select': 
        if (this.state.tokens.length > 0)
          page = <Sortable2
            columns={selectHeader}
            data={this.state.tokens}
            navigation={true}
            maxShown={5}
            />
      break;
      case 'percent': 
        if (this.state.selected.length > 0) {
          const selected = this.state.selected.map((token, i) => {
            if (this.state.inputData[token.name] === undefined)
              this.state.inputData[token.name] = {
                percent: '',
                analysis: '',
                comments: '',
              }
            return {
              id: token.id,
              icon: token.icon,
              name: token.name,
              percent: <input value={this.state.inputData[token.name].percent} onChange={(event) => this.changeTokenData(token.name, 'percent', event.target.value)} placeholder="Percent" type="number" min="0" max="100"/>,
              analysis: <input value={this.state.inputData[token.name].analysis} onChange={(event) => this.changeTokenData(token.name, 'analysis', event.target.value)} placeholder="Analysis" type="text"/>,
              comments: <input value={this.state.inputData[token.name].comments} onChange={(event) => this.changeTokenData(token.name, 'comments', event.target.value)} placeholder="Comments" type="text"/>,
            }
          });
          // на самом деле это не сортируемо
          page = <div className="sortable">
            <div className="header">
              {percentHeader.map((header, i) => {
                return <div className="cell" key={i} style={{width: header.width}}>
                  {header.title}
                </div>
              })}
            </div>
            <ul className="listings">
              {selected.map((listing, i) => {
                return <li key={i} className="listing">
                  {percentHeader.map((header, i) => {
                    return <div key={i} className="cell" style={{width: header.width}}>
                      {listing[header.property]}
                    </div>
                  })}
                </li>
              })}
            </ul>
          </div>
        } else {
          page = 'select tokens'
        }
      break;
    }
    return (<div className='container'>
          <div className='box'>
            {this.state.investor !== null ? 
              <RequestHeader
                requestData={{investor: this.state.investor, request: this.state.request}}
              /> : 'Loading...'}
          </div>
          {this.state.initiatedByManager ? <div className="box">
            <div className="row">
              Create new portfolio and set additional data to send you offer to investor
            </div>
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
            <div className="row">
              <p>Comment for Investor</p>
            </div>
            <div className="row">
              <input type="text" value={this.state.comment} onChange={(event) => this.setState({comment: event.target.value})} />
            </div>

          </div> : <RequestDetails request={this.state.request} />}
          <div className='box'>
            {(this.state.request && (this.state.request.status === 'pending' || this.state.request.status === 'not created')) && <button className='porfolio-creation-tabs' onClick={() => this.setState({page: 'fees'})}>Fees</button>}
            <button className='porfolio-creation-tabs' onClick={() => this.setState({page: 'select'})}>Tokens selecting</button>
            <button className='porfolio-creation-tabs' onClick={() => this.setState({page: 'percent'})}>Tokens percent changing</button>
            <button className='big-blue-button right' style={{marginLeft: 20}} onClick={() => this.send()}>Send</button>
            {this.state.initiatedByManager ? '' : <button className='big-blue-button right' onClick={() => this.save()}>Save</button>}
          </div>
          <div className='box'>
            {page || 'Loading...'}
          </div>
        </div>)
  }
}
export default connect(a => a)(PortfolioCreationPage);



let percentHeader = [
  {
    property: 'id',
    title: '#',
    width: '41px',
    type: 'number',
  },
  {
    property: 'name',
    title: 'Token',
    width: '121px',
  },
  {
    property: 'icon',
    title: 'icon',
    width: '41px',
    type: 'unsortable',
  },
  {
    property: 'percent',
    title: 'percent',
    width: '100px',
    type: 'unsortable',
  },
  {
    property: 'analysis',
    title: 'analysis',
    width: '190px',
    type: 'unsortable'
  },
  {
    property: 'comments',
    title: 'comments',
    width: '190px',
    type: 'unsortable'
  },
]

let selectHeader = [
  {
    property: 'id',
    title: '#',
    width: '41px',
    type: 'number',
  },
  {
    property: 'icon',
    title: 'icon',
    width: '41px',
    type: 'unsortable',
  },
  {
    property: 'name',
    title: 'Token',
    width: '300px',
  },
  {
    property: 'volume',
    title: 'volume',
    width: '100px',
    type: 'number',
  },
  {
    property: 'price',
    title: 'Last price',
    width: '100px',
    type: 'number',
  },
  {
    property: 'action',
    title: '',
    width: '150px',
    type: 'unsortable'
  },
]
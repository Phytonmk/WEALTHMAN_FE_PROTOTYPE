import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable2 from '../Sortable2.jsx';
import myDate from '../myDate.jsx';
import { api, setPage, setCurrency, previousPage } from '../helpers';
import {default as RequestHeader} from './RequestPage/Header';
import {default as RequestDetails} from './RequestPage/Details';



class PortfolioCreationPage extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      selected: [],
      tokens: [],
      selectedIds: [],
      request: null,
      investor: null,
      page: 'select',
      inputData: {},
      activeExists: false,
      exit_fee: '',
      managment_fee: '',
      perfomance_fee: '',
      front_fee: '',
    };
  }
  componentWillMount() {
    api.get('stocks')
      .then((res) => {
        const tokens = res.data.map((token, i) => { return {
          id: i,
          icon: <img src={token.token_img} className="token-icon" />,
          name: token.name,
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
        });
      })
      .catch(console.log);
    api.post('portfolio/load-draft', {
      request: this.props.match.params.id,
    })
      .then((res) => {
        const selected = [];
        const inputData = {};
        if (res.data.exists) {
          let i = 0;
          for (let token of res.data.portfolio.currencies) {
            selected.push({
              name: token.currency,
              id: i++,
              icon: '',
            });
            inputData[token.currency] = {
              percent: token.percent,
              amount: token.amount,
              analysis: token.analysis,
              comments: token.comments,
            }
          }
          this.setState({selected, inputData, activeExists: res.data.activeExists});
        }
      })
      .catch(console.log);
  }
  updateButtons() {
    const state = Object.assign({}, this.state);
    state.tokens.map(token => {
      if (this.state.selectedIds.includes(token.id))
        token.action = <button className="big-red-button" onClick={() => this.removeToken(token)}>Remove</button>
      else
        token.action = <button className="big-blue-button" onClick={() => this.addToken(token)}>Add</button>
      return token;
    });
    this.setState(state);
  }
  removeToken(token) {
    const state = Object.assign({}, this.state);
    state.selected.splice(state.selectedIds.indexOf(token.id), 1);
    state.selectedIds.splice(state.selectedIds.indexOf(token.id), 1);
    this.setState(state);
    setTimeout(() => this.updateButtons(), 0);
  }
  addToken(token) {
    const state = Object.assign({}, this.state);
    if (state.inputData[token.name] === undefined)
      state.inputData[token.name] = {
        percent: '',
        amount: '',
        analysis: '',
        comments: '',
      };
    state.selected.push(Object.assign({}, token));
    state.selectedIds.push(token.id);
    this.setState(state);
    setTimeout(() => this.updateButtons(), 0);
  }
  changeTokenData(token, property, value) {
    const state = Object.assign({}, this.state);
    state.inputData[token][property] = value;
    this.setState(state);
    setTimeout(() => this.forceUpdate(), 0);
  }
  save(callback) {
    const sendData = [];
    for (let token in this.state.selected) {
      const tokenName = this.state.selected[token].name;
      sendData.push({
        currency: tokenName,
        percent: this.state.inputData[tokenName].percent * 1,
        amount: this.state.inputData[tokenName].amount * 1,
        analysis: this.state.inputData[tokenName].analysis,
        comments: this.state.inputData[tokenName].comments,
      });
    }
    api.post('portfolio/save', {
      request: this.props.match.params.id,
      currencies: sendData,
      fees: {
        exit_fee: this.state.exit_fee,
        managment_fee: this.state.managment_fee,
        perfomance_fee: this.state.perfomance_fee,
        front_fee: this.state.front_fee,
      }
    })
      .then(() => {
        if (typeof callback === 'function')
          callback();
        else
          setPage('requests');
      })
      .catch(console.log);

  }
  send() {
    this.save(() => {
      api.post(`portfolio/${this.state.activeExists ? 'review' : 'propose'}/${this.props.match.params.id}`)
        .then(() => setPage('requests'))
        .catch(console.log);
    })
  }
  render() {
    let page = '';
    switch(this.state.page) {
      case 'fees':
        page = <div>
          <div className="row">{this.state.request.status === 'pending' ? 'Request is pending, so you can set custom fees, investor may accept or decline them' : 'Request is not pending, so you unable to change them'}</div>
          <div className="row">Exit fee:</div><div className="row"><input type="number" step="1" min="0" max="100" value={this.state.exit_fee} onChange={(event) => this.state.request.status === 'pending' ? this.setState({exit_fee: event.target.value}) : ''}/> %</div>
          <div className="row">Management fee:</div><div className="row"><input type="number" step="1" min="0" max="100" value={this.state.managment_fee} onChange={(event) => this.state.request.status === 'pending' ? this.setState({managment_fee: event.target.value}) : ''}/> %</div>
          <div className="row">Perfomance fee:</div><div className="row"><input type="number" step="1" min="0" max="100" value={this.state.perfomance_fee} onChange={(event) => this.state.request.status === 'pending' ? this.setState({perfomance_fee: event.target.value}) : ''}/> %</div>
          <div className="row">Front fee:</div><div className="row"><input type="number" step="1" min="0" max="100" value={this.state.front_fee} onChange={(event) => this.state.request.status === 'pending' ? this.setState({front_fee: event.target.value}) : ''}/> %</div>
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
                amount: '',
                analysis: '',
                comments: '',
              }
            return {
              id: token.id,
              icon: <img src={token.icon} className="token-icon" />,
              name: token.name,
              percent: <input value={this.state.inputData[token.name].percent} onChange={(event) => this.changeTokenData(token.name, 'percent', event.target.value)} placeholder="Percent" type="number" min="0" max="100"/>,
              amount: <input value={this.state.inputData[token.name].amount} onChange={(event) => this.changeTokenData(token.name, 'amount', event.target.value)} placeholder="Amount" type="number" min="0"/>,
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
                name={(this.state.investor .name || '') + ' ' + (this.state.investor .name || '')}
                img={api.imgUrl(this.state.investor.img)}
                userId={this.state.investor.id}
                requestId={this.state.request !== null ? this.state.request.id : ''}
                requestDate={this.state.request !== null ? this.state.request.date : ''}
                buttons={''}
              /> : 'Loading...'}
          </div>
          <RequestDetails request={this.state.request} />
          <div className='box'>
            <button className='porfolio-creation-tabs' onClick={() => this.setState({page: 'fees'})}>Fees</button>
            <button className='porfolio-creation-tabs' onClick={() => this.setState({page: 'select'})}>Tokens selecting</button>
            <button className='porfolio-creation-tabs' onClick={() => this.setState({page: 'percent'})}>Tokens percent changing</button>
            <button className='big-blue-button right' style={{marginLeft: 20}} onClick={() => this.send()}>Send</button>
            <button className='big-blue-button right' onClick={() => this.save()}>Save</button>
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
    property: 'amount',
    title: 'amount',
    width: '100px',
    type: 'unsortable',
  },
  {
    property: 'analysis',
    title: 'analysis',
    width: '300px',
    type: 'unsortable'
  },
  {
    property: 'comments',
    title: 'comments',
    width: '300px',
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
    width: '100px',
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
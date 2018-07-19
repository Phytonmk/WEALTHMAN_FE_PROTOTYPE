import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable2 from '../Sortable2.jsx';
import myDate from '../myDate.jsx';
import { api, setPage, setCurrency, previousPage } from '../helpers';
import {default as RequestHeader} from './RequestPage/Header';
import {default as RequestDetails} from './RequestPage/Details';

let stocks = [];
let stockTableCacheIsOld = true;


let percentHeader = [
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
    property: 'percent',
    title: 'percent',
    width: '100px',
    type: 'unsortable',
  },
  // {
  //   property: 'amount',
  //   title: 'amount',
  //   width: '100px',
  //   type: 'unsortable',
  // },
  // {
  //   property: 'analysis',
  //   title: 'analysis',
  //   width: '100px',
  //   type: 'unsortable'
  // },
  // {
  //   property: 'comments',
  //   title: 'comments',
  //   width: '100px',
  //   type: 'unsortable'
  // },
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

class PortfolioCreationPage extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      selected: [],
      tokens: [],
      selectedIds: [],
      request: null,
      investor: null,
      page: 'percent',
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
          action: '',
          percent: <input />
        }});
        this.setState({tokens: tokens});
        this.setState({selected: tokens});
        setTimeout(() => this.updateButtons(), 0);
        // this.setState({stocks: res.data});
        // setReduxState({tokens: res.data.map(token => { return {
        //   name: token.name,
        //   symbol: token.name,
        //   price_usd: 1,
        //   price_btc: token.volume,
        //   market_cap_usd: 1
        // }})})
      })
      .catch(console.log)
    api.post('get-request/' + this.props.match.params.id)
      .then((res) => {
        this.setState({
          request: res.data.request,
          investor: res.data.investor
        });
      })
      .catch(console.log);
    api.post('portfolio/load', {
      request: this.props.match.params.id,
    })
      .then((res) => {
        // stockTableCacheIsOld = true;
        // const selectedTokens = [];
        // if (res.data.exists)
        //   for (let token of res.data.portfolio.currencies) {
        //     selectedTokens.push(token.currency);
        //     this.setState({
        //       [token.currency + '-percent']: token.percent,
        //       [token.currency + '-amount']: token.amount,
        //       [token.currency + '-analysis']: token.analysis,
        //       [token.currency + '-comments']: token.comments,
        //     })
        //   }
        // this.setState({selectedTokens});
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
    state.selected.push({
      id: token.id,
      icon: <img src={token.icon} className="token-icon" />,
      name: token.name,
      percent: <input />
    });
    state.selectedIds.push(token.id);
    this.setState(state);
    setTimeout(() => this.updateButtons(), 0);
  }
  render() {
    let page;
    // switch(this.state.page) {
    //   case 'select': 
    //     if (this.state.tokens.length > 0)
    //       page = <Sortable2
    //         columns={selectHeader}
    //         data={this.state.tokens}
    //         navigation={true}
    //         maxShown={5}
    //         />
    //   break;
    //   case 'percent': 
    //     if (this.state.selected.length > 0) {
    //       page = <Sortable2
    //         columns={percentHeader}
    //         data={this.state.selected}
    //         navigation={true}
    //         maxShown={5}
    //         />
    //     } else {
    //       page = 'select tokens'
    //     }
    //   break;
    // }
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
            <button className='porfolio-creation-tabs' onClick={() => this.setState({page: 'select'})}>Tokens selecting</button>
            <button className='porfolio-creation-tabs' onClick={() => this.setState({page: 'percent'})}>Tokens percent changing</button>
          </div>
          <div className='box'>
            {page || 'Loading...'}
          </div>
        </div>)
  }
}
export default connect(a => a)(PortfolioCreationPage);


  // removeFromList(name) {
  //   stockTableCacheIsOld = true;
  //   const selectedTokens = [...this.state.selectedTokens];
  //   if (selectedTokens.includes(name)) {
  //     selectedTokens.splice(selectedTokens.indexOf(name), 1);
  //     this.setState({selectedTokens});
  //   }
  // }
  // save(callback) {
  //   const sendData = [];
  //   for (let token of this.state.selectedTokens) {
  //     sendData.push({
  //       currency: token,
  //       percent: this.state[token + '-percent'] * 1,
  //       amount: this.state[token + '-amount'] * 1,
  //       analysis: this.state[token + '-analysis'],
  //       comments: this.state[token + '-comments'],
  //     });
  //   }
  //   api.post('portfolio/save', {
  //     request: this.props.match.params.id,
  //     currencies: sendData
  //   })
  //     .then(() => {
  //       if (typeof callback === 'function')
  //         callback();
  //       else
  //         setPage('requests');
  //     })
  //     .catch(console.log);

  // }
  // send() {
  //   this.save(() => {
  //     api.post('pending-request/' + this.props.match.params.id)
  //       .then(() => setPage('requests'))
  //       .catch(console.log);
  //   })
  // }
  // render() {
  //   var set = 'USD';
  //   var titles = [
  //     // {
  //     //   title: '#',
  //     //   tooltip: 'number',
  //     //   class: 'number',
  //     // },
  //     {
  //       title: 'Token',
  //       tooltip: 'Token',
  //       class: 'token',
  //     },
  //     {
  //       title: 'last price, BTC',
  //       tooltip: 'last price',
  //       class: 'lastprice',
  //     },
  //     {
  //       title: '24 change, %',
  //       tooltip: 'rating',
  //       class: 'change24',
  //     },
  //     {
  //       title: 'DHP',
  //       tooltip: 'Dayli high price, BTC',
  //       class: 'dhp',
  //     },
  //     // {
  //     //   title: 'DLP',
  //     //   tooltip: 'Dayli low price, BTC',
  //     //   class: 'dlpp',
  //     // },
  //     {
  //       title: 'Volume',
  //       tooltip: 'Volume, BTC',
  //       class: 'volume',
  //     },
  //     {
  //       title: 'add',
  //       tooltip: '',
  //       class: 'add',
  //     },
  //   ];
  //   if (stockTableCacheIsOld) {
  //     if (this.state.stocks.length > 0) {
  //       stockTableCacheIsOld = false;
  //       console.log(this.state.selectedTokens);
  //       stocks = this.state.stocks.map((stock, i) => { return {
  //         // number: i,
  //         token: stock.name,
  //         lastprice: stock.last_price,
  //         change24: stock.change_percnt,
  //         dhp: stock.high_price,
  //         // dlp: stock.low_price,
  //         volume: stock.volume,
  //         add: this.state.selectedTokens.includes(stock.name) ? 'added' : 'add',
  //         noLink: true,
  //         onClick: (event, listings) => {
  //           if (event.target.textContent === 'add') {
  //             stockTableCacheIsOld = true;
  //             const selectedTokens = [...this.state.selectedTokens];
  //             selectedTokens.push(listings.token)
  //             this.setState({selectedTokens});
  //           }
  //         }
  //       }});
  //     }
  //   }
  // console.log(this.props.tokens);
  // var tokens = this.props.tokens.map((token, index) => <li key={index} style={this.state.selectedTokens.includes(token.name) ? {display: 'block'} : {display: 'none'}}>
  //       <div className='number'>
  //         {index + 1}
  //       </div>
  //       <div className='currency'>
  //         {token.name}
  //       </div>
  //       <div className='percent'>
  //         <input value={this.state[token.name + '-percent']} onChange={(event) => this.setState({[token.name + '-percent']: event.target.value})} type='number' min='0' max='100'></input>
  //       </div>
  //       <div className='amount'>
  //         <input value={this.state[token.name + '-amount']} onChange={(event) => this.setState({[token.name + '-amount']: event.target.value})} type='number'  min='0'></input>
  //       </div>
  //       <div className='value'>
  //         {set}
  //       </div>
  //       <div className='remove last' onClick={() => this.removeFromList(token.name)}>
  //         Remove
  //       </div>
  //       <div className='comments last'>
  //         <input value={this.state[token.name + '-comments']} onChange={(event) => this.setState({[token.name + '-comments']: event.target.value})} type='text'></input>
  //       </div>
  //       <div className='analysis last'>
  //         <input value={this.state[token.name + '-analysis']} onChange={(event) => this.setState({[token.name + '-analysis']: event.target.value})} type='text'></input>
  //       </div>
  //     </li>
  //   );

  //   console.log(this.props.requests);
  //   var request = this.props.requests.find(r => r.id == this.props.match.params.id);
  //   if (request === undefined)
  //     return <p> Loading... </p>
  //   var investor = this.props.investors.find(i => i.id == request.investor);
  //   if (investor === undefined)
  //     return <p> Loading... </p>
  //   var name;
  //   var age;
  //   if (investor.kyc == 'yes') {
  //     name = <h4>{investor.name} {investor.surname}</h4>;
  //     age = <p>{investor.age} years old</p>;
  //   }
  //   else {
  //     name = <h4>{investor.email}</h4>;
  //     age = <p>KYC unfullfilled</p>;
  //   }

  //   return (
  //     <div>
  //       <div className='container'>
  //         <div className='box'>
  //           <h3>Portfolio Creation</h3>

  //           <div className='circle left'>
  //             <img src={'../investor/' + investor.img} className='avatar' />
  //           </div>
  //           <div className='third'>
  //             <h4>{investor.name} {investor.surname}</h4>
  //             <p>user id #<b>{investor.id}</b></p>
  //           </div>
  //           <div className='third text-right'>
  //             <p>request number #<b>{request.id}</b></p>
  //             <p>created: <b>{new myDate(request.date).niceTime()}</b></p>
  //           </div>
  //           <div className='row-padding'>
  //             <Link to={'/chat'}>
  //               <button className='continue' onClick={() => setPage('chat')}>Start chat</button>
  //             </Link>
  //           </div>
  //           <p><b>Target value:</b> {request.value} ETH</p>
  //           <p><b>Risk profile:</b> {investor.riskprofile}</p>
  //           <p><b>Investor comment:</b> {request.comment ? request.comment : 'nothing'}</p>
  //           <p><b>Analysis Neccesity:</b> {(request.options || {}).analysis ? 'yes' : 'no'}</p>
  //           <p><b>Comment Neccesity:</b> {(request.options || {}).comment ? 'yes' : 'no'}</p>



  //           <ul className='token-listings'>
  //             <li className='titles'>
  //               <div className='number'>
  //                 #
  //               </div>
  //               <div className='currency'>
  //                 Currency
  //               </div>
  //               <div className='percent'>
  //                 % in portfolio
  //               </div>
  //               <div className='amount'>
  //                 Amount
  //               </div>
  //               <div className='value'>
  //                 Value in set currency
  //               </div>
  //               <div className='remove last'>
  //                 Remove
  //               </div>
  //               <div className='comments last'>
  //                 Comments
  //               </div>
  //               <div className='analysis last'>
  //                 Analysis
  //               </div>
  //             </li>
  //             {tokens}
  //           </ul>
  //         </div>
  //         <div className='box'>
  //           <div className='row-padding'>
  //             <button className='continue right margin' onClick={() => this.send()}>Send</button>
  //             <button className='continue right margin' onClick={() => this.save()}>Save</button>
  //             {/*<button className='continue right margin'>Load Saved form</button>*/}
  //           </div>
  //         </div>
  //         <div className='box' style={{maxHeight: 500, overflowY: 'auto'}}>
  //           {this.state.stocks.length > 0 && <div className='stocks-sortable'><Sortable
  //             titles={titles}
  //             listings={stocks}
  //             currencySelector={
  //               <select value={this.state.stocks[0].title} onChange={() => {}/*setCurrency.bind(this)*/}>
  //                 {
  //                   this.state.stocks.map((c, i) =>
  //                     <option key={i} value={c.title}>{c.title}</option>
  //                   )
  //                 }
  //               </select>
  //             }
  //           /></div>}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }



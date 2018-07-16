import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable2 from '../Sortable2.jsx';
import { api, setPage, setCurrency } from '../helpers';

class PortfoliosPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gotData: false
    }
  }
  componentWillMount() {
    api.post('portfolios/load')
      .then((res) => {
        console.log(this.props.portfolios, res.data.portfolios)
        if (res.data.exists) {
          setReduxState({portfolios: res.data.portfolios});
        } else {
          setReduxState({portfolios: []});
        }
        this.setState({gotData: true});
      })
      .catch(console.log);
    api.get('stocks')
      .then((res) => {
        setReduxState({currentCurrencyPrices: res.data.map(stock => {return {name: stock.title, price: stock.last_price}})});
      })
      .catch(console.log);
  }
  render() {
    if (!this.state.gotData)
      return <div className="box loading"><p>Loading</p></div>
    var currentPage;
    var currencies = this.props.currentCurrencyPrices.map((c, i) =>
      <option key={i} value={c.name}>{c.name}</option>
    );
    var currentCurrency = this.props.currentCurrencyPrices.find(c => c.name == this.props.currentCurrency) || {price: 0};
    let totalValue
    if (this.props.portfolios.length > 0)
      totalValue = this.props.portfolios
        .map(p => {
          let price = 0;
          if (this.props.currentCurrencyPrices.find(c => c.name == p.currency) !== undefined)
            price = this.props.currentCurrencyPrices.find(c => c.name == p.currency).price;
          // return (p.value - p.cost) * price;
          return p.value * price;
        })
        .reduce((a, b) => a + b);
    else
      totalValue = 0;

    var titles = [
      {
        property:"number",
        title: "#",
        tooltip: "number",
        width: "30px",
      },
      {
        property: "number_portfolio",
        title: "portfolio",
        tooltip: "number of portfolio",
        width: "50px",
      },
      {
        property: "manager",
        title: "Manager",
        tooltip: "Manager that manage this portfolio",
        width: "100px",
      },
      {
        property: "smartCntract",
        title: "smart-cntract",
        tooltip: "number of smart contract",
        class: "number-smart",
        width: "180px",
      },
      // {
      //   property: "instrument",
      //   title: "instrument",
      //   tooltip: "name of algorythm",
      //   class: "instrument",
      // },
      {
        property: "profit",
        title: "profit",
        tooltip: "current profit",
        class: "profit",
        width: "150px",
      },
      // {
      //   property: "value",
      //   title: "value",
      //   tooltip: "value of portfolio",
      //   class: "value",
      // },
      {
        property: "status",
        title: "status",
        tooltip: "status of portfolio",
        class: "status",
        width: "100px",
      },
      {
        property: "cost",
        title: "cost",
        tooltip: "commision",
        class: "cost",
        width: "150px",
      },
      {
        property: "details",
        width: "135px",
        type: "unsortable",
      },
      {
        property: "withdraw",
        width: "85px",
        type: "unsortable",
      },
    ];
    var portfolios = this.props.portfolios.map((portfolio, i) => {
      var investor = this.props.investors.find(inv => inv.id == portfolio.investor);
      var manager = this.props.managers.find(m => m.id == portfolio.manager);
      var alg = this.props.algorythms.find(alg => alg.id == portfolio.alg) || {};
      let price = 0; 
      if (this.props.currentCurrencyPrices.find(c => c.name == portfolio.currency) !== undefined)
        price = this.props.currentCurrencyPrices.find(c => c.name == portfolio.currency).price;
      return {
        type: "portfolio",
        number: i,
        manager: manager.name + ' ' + manager.surname,
        id: portfolio.request,
        number_portfolio: portfolio.id,
        smartCntract: <span className="smart-contract-sizer">{portfolio.smart_contract}</span>,
        // instrument: alg.name,
        profit: "тут будет график",
        // currency: portfolio.currency,
        // percent_portfolio: (portfolio.value * price / totalValue * 100).toFixed(1),
        // amount: portfolio.value,
        // value: (portfolio.value * price / currentCurrency.price).toFixed(3) + " " + currentCurrency.name,
        status: portfolio.status,
        cost: "тут будет график",//(portfolio.cost * price / currentCurrency.price).toFixed(3) + " " + currentCurrency.name,
        // analysis: "link.com",
        // comments: "comment",
        details: <Link to={"/portfolio/" + portfolio.request} className="no-margin">
            <button className="big-blue-button">
              Details
            </button>
          </Link>,
        withdraw: <Link to={"/withdraw/" + portfolio.request} className="no-margin">
            <button className="big-blue-button">
              Withdraw
            </button>
          </Link>
      };
    });

    var statistics;

    switch (this.props.currentPortfoliosPage) {
      case "active":
        currentPage = (
          <div className="box portfolios-page">
            <h4>Active Portfolios</h4>
            <Sortable2
              filter={row => true/*row.name.toLowerCase().includes(this.state.searchName.toLowerCase())*/}
              columns={titles}
              data={portfolios}
            />
          </div>
        );
        break;
      // case "archived":
      //   currentPage = (
      //     <div className="box">
      //       <h4>Archived Portfolios</h4>
      //       <Sortable2
      //         titles={titles}
      //         listings={portfolios}
      //         setPage={setPage.bind(this)}
      //         currencySelector={
      //           <select value={this.props.currentCurrency} onChange={setCurrency.bind(this)}>
      //             {
      //               this.props.currentCurrencyPrices.map((c, i) =>
      //                 <option key={i} value={c.name}>{c.name}</option>
      //               )
      //             }
      //           </select>
      //         }
      //       />
      //     </div>
      //   );
      //   break;
      // case "statistics":
      //   currentPage = (
      //     <div className="box">
      //       <h4>Statistics</h4>
      //       {statistics}
      //     </div>
      //   );
      //   break;
      // /* NEW ONES */
      // case "proposed":
      //   currentPage = (
      //     <div className="box">
      //       <h4>Proposed Portfolios</h4>
      //       <Sortable2
      //         titles={titles}
      //         listings={portfolios}
      //         setPage={setPage.bind(this)}
      //         currencySelector={
      //           <select value={this.props.currentCurrency} onChange={setCurrency.bind(this)}>
      //             {
      //               this.props.currentCurrencyPrices.map((c, i) =>
      //                 <option key={i} value={c.name}>{c.name}</option>
      //               )
      //             }
      //           </select>
      //         }
      //       />
      //     </div>
      //   );
      //   break;
      //   case "revision":
      //     currentPage = (
      //       <div className="box">
      //         <h4>Portfolios on revision</h4>
      //         <Sortable2
      //           titles={titles}
      //           listings={portfolios}
      //           setPage={setPage.bind(this)}
      //           currencySelector={
      //             <select value={this.props.currentCurrency} onChange={setCurrency.bind(this)}>
      //               {
      //                 this.props.currentCurrencyPrices.map((c, i) =>
      //                   <option key={i} value={c.name}>{c.name}</option>
      //                 )
      //               }
      //             </select>
      //           }
      //         />
      //       </div>
      //     );
      //     break;
      //     case "recalculated":
      //       currentPage = (
      //         <div className="box">
      //           <h4>Recalculated Portfolios</h4>
      //           <Sortable2
      //             titles={titles}
      //             listings={portfolios}
      //             setPage={setPage.bind(this)}
      //             currencySelector={
      //               <select value={this.props.currentCurrency} onChange={setCurrency.bind(this)}>
      //                 {
      //                   this.props.currentCurrencyPrices.map((c, i) =>
      //                     <option key={i} value={c.name}>{c.name}</option>
      //                   )
      //                 }
      //               </select>
      //             }
      //           />
      //         </div>
      //       );
      //       break;
    }

    return (
      <div>
        <div className="second-header">
          <div className="container">
            <div className="title">
              <h2>My Portfolios</h2>
              <p className="grey">Total value</p>
            </div>
            <div className="description" style={{width: 300}}>
              <h2>{/*(totalValue / currentCurrency.price).toFixed(3) + " " + currentCurrency.name*/}</h2>
              <select value={this.props.currentCurrency} onChange={setCurrency.bind(this)}>
                {currencies}
              </select>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="upper-tab">
            <div className="box">
              <button className="transactions-link" onClick={() => setReduxState({ currentPortfoliosPage: "proposed" })}>Proposed (Initial)</button>
              <button className="transactions-link" onClick={() => setReduxState({ currentPortfoliosPage: "active" })}>Active</button>
              <button className="transactions-link" onClick={() => setReduxState({ currentPortfoliosPage: "revision" })}>Revision</button>
              <button className="transactions-link" onClick={() => setReduxState({ currentPortfoliosPage: "recalculated" })}>Recalculated</button>
              <button className="transactions-link" onClick={() => setReduxState({ currentPortfoliosPage: "archived" })}>Archived</button>
              <button className="transactions-link" onClick={() => setReduxState({ currentPortfoliosPage: "statistics" })}>Statistics</button>
            </div>
          </div>
          {currentPage}
        </div>
      </div>
    );
  }
}

export default connect(a => a)(PortfoliosPage);
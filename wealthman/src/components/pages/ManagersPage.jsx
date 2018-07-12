import React, { Component } from 'react';
import { setReduxState } from '../../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sortable from '../Sortable.jsx';
import { api, setPage, setCurrency } from '../helpers';

class ManagersPage extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    api.get('managers')
      .then((res) => {
        setReduxState({managers: res.data});
      })
      .catch(console.log);
  }
  render() {
    var titles = [
      {
        title: "#",
        tooltip: "number",
        class: "number",
      },
      {
        title: "",
        tooltip: "",
        class: "none",
      },
      {
        title: "Name",
        tooltip: "manager name",
        class: "name",
      },
      {
        title: "Success rate",
        tooltip: "rating",
        class: "rating",
      },
      {
        title: "number of clients",
        tooltip: "number of clients",
        class: "clients",
      },

      {
        title: "AUM",
        tooltip: "AUM",
        class: "aum",
      },
      {
        title: "% of Net Assets",
        tooltip: "% of Net Assets",
        class: "assets",
        upper: "Expense ratio",
      },
      {
        title: "% of Perfomance",
        tooltip: "% of Perfomance",
        class: "profit",
        upper: "Expense ratio",
      },
      {
        title: "% Front fee",
        tooltip: "% Front fee",
        class: "initial",
        upper: "Expense ratio",
      },
      {
        title: "% exit Fee",
        tooltip: "% Exit fee",
        class: "output",
        upper: "Expense ratio",
      },
      {
        title: "minimum investment",
        tooltip: "minimum investment",
        class: "annual",
      },
      {
        title: "6M AUM Graph",
        tooltip: "6M AUM Graph",
        class: "aum6",
      },
      {
        title: "",
        tooltip: "",
        class: "none",
      },
    ];
    var managers = this.props.managers.map(manager => {
      return {
        type: "manager",
        id: manager.id,
        number: "",
        img: manager.img ? api.imgUrl(manager.img) : '',
        name: manager.name + " " + manager.surname,
        rating: manager.rating,
        clients: manager.clients,
        // aum: <img src="graph.png" className="graph" />,
        // assets: <img src="graph.png" className="graph" />,
        // profit: <img src="graph.png" className="graph" />,
        aum: 10,
        assets: 10,
        profit: 10,
        initial: manager.initial,
        output: manager.output,
        annual: manager.annual,
        aum6: <img src="graph.png" className="graph" />,
        cart: <img src="cart.png" className="graph" />,
      };
    });

    var filters = [
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
      }
    ];
    var filtersMapped = filters.map((filter, i) =>
      <button key={i} className={"blue-link left" + (this.props.managersFilter == filter.link ? " active" : "")} onClick={() => setReduxState({managersFilter: filter.link})}>
        {filter.link}
      </button>
    );

    return (
      <div>
        <div className="long-header"></div>
        <div className="container">
          <div className="box">
            <h3>Marketplace</h3>
            <div className="row">
              <div className="column center">
                {filtersMapped}
              </div>
            </div>
            <div className="row-padding">
              {filters.find(filter => filter.link == this.props.managersFilter).description}
              <Link to="faq" className="grey-link" onClick={() => {setPage("faq"); setReduxState({faqId: filters.find(filter => filter.link == this.props.managersFilter).link})}}>
                Learn more
              </Link>
            </div>
            <div className="row-padding">
              <div className="fourth">
                Total investors: 3
              </div>
              <div className="fourth">
                Total managers: 3
              </div>
              <div className="fourth">
                Total AUM: 3 mln $
              </div>
            </div>
            <div className="row-padding">
              <Sortable
                titles={titles}
                listings={managers}
                setPage={setPage.bind(this)}
                currencySelector={
                  <select value={this.props.currentCurrency} onChange={setCurrency.bind(this)}>
                    {
                      this.props.currentCurrencyPrices.map((c, i) =>
                        <option key={i} value={c.name}>{c.name}</option>
                      )
                    }
                  </select>
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}



export default connect(a => a)(ManagersPage);
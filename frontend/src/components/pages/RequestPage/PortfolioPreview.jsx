import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Sortable2 from '../../Sortable2.jsx'
import LevDate from '../../LevDate.jsx'
import portfolioValues from '../../portfolioValues'
import Graphics from '../../dashboards/Graphics';

let sortableHeader = [
  {
    property: "number",
    title: "#",
    width: "41px",
    type: "number",
  },
  {
    property: "currency",
    title: "currency",
    width: "100px",
  },
  {
    property: "percent",
    title: "percent",
    width: "100px",
    type: "number",
  },
  {
    property: "analysis",
    title: "analysis",
    width: "100px",
  },
  {
    property: "comments",
    title: "comments",
    width: "100px",
  },
]

class PortfolioPreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // portfolioValues: [],
      // requestedPorfolios: false
      valueGraphic: []
    }
  }
  componentDidMount() {
    if (!this.state.requestedPorfolios && this.props.requestData && this.props.requestData.portfolio) {
      const date = new LevDate()
      date.addDay(1)
      portfolioValues(this.props.requestData.portfolio.currencies, 1, 'year', (result) => {
        this.setState({ valueGraphic: result.reverse().map((chunk) => {
          date.addDay(-1)
          return {
            title: date.getTime(),
            value: chunk
          }
        }) })
      })
    }
  }
  render() {
    // if (!this.state.requestedPorfolios && this.props.requestData && this.props.requestData.portfolio) {
    //   this.state.requestedPorfolios = true // mutation (sic!)
    //   portfolioValues(this.props.requestData.portfolio.currencies, this.props.requestData.request.value, false, (graphic) => {
    //     const portfolioValues = [...this.state.portfolioValues]
    //     portfolioValues.push(graphic)
    //     portfolioValues.sort((a, b) => {
    //       if (a.data.length < b.data.length)
    //         return -1
    //       else
    //         return 1
    //     })
    //     this.setState({portfolioValues})   
    //   })
    // }
    const portfolio = []
    const tokens = [...this.props.requestData.portfolio.currencies]
    let i = 0
    for (let token of tokens) {
      for (let property in token) {
        if (!token[property]) {
          switch (property) {
            case 'analysis':
              token[property] = 'no analysis'
            break
            case 'comments':
              token[property] = 'no comment'
            break
            case 'percent':
              token[property] = '0'
            break
            default:
              token[property] = ''
          }
        }
        if (property === 'percent' && token[property].toString().indexOf('%') === -1)
          token[property] += ' %'
      }
      token.id = ++i
      token.number = token.id
      portfolio.push(token)
    }
    return (
      <React.Fragment>
          <Graphics
            graphics={[{
              type: 'pie-line',
              pie: {
                title: 'Portfolio allocation',
                datasets: [{
                  title: 'Current',
                  inCircleValue: this.props.requestData.request.value,
                  inCircleTitle: 'Eth',
                  data: this.props.requestData.portfolio.currencies.sort((a, b) => a.percent > b.percent ? -1 : 1).map(currency => {return {
                    header: currency.percent.toString().replace(/[^0-9]/g, '') + '% ' + currency.currency,
                    value: currency.percent.toString().replace(/[^0-9]/g, '')
                  }})
                }]
              },
              line: {
                title: 'Portfolio value',
                lines: [{data: this.state.valueGraphic}]
              }
            }]}
         />
         <br/>
        <div className="box">
          <Sortable2
            columns={sortableHeader}
            data={portfolio}
            navigation={true}
            maxShown={5}
          />
        </div>
      </React.Fragment>)
  }
}

export default PortfolioPreview
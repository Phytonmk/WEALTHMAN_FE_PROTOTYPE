
/*

Usage example

    <Graphics
        pie={{
          title: 'Portfolios',
          datasets: [{
            title: 'All time',
            inCircleValue: '10', // if not specified calculates as a sum of all values of the dataset
            inCircleTitle: 'All',
            data: [{
              header: 'Active',
              value: 25
            },{
              header: 'Archived',
              value: 75
            },{
              header: 'In progress',
              value: 85
            }]
          }, {
            title: 'Yesterday',
            inCircleTitle: 'All',
            data: [{
              header: 'Active',
              value: 25
            },{
              header: 'Archived',
              value: 75
            },{
              header: 'In progress',
              value: 85
            },{
              header: 'Bumped',
              value: 50
            }]
          }]
        }}
        main={{
          title: 'Portfolio value',
          datasets: [{
            title: 'Jun 22 - Jul 16, 2018',
            data: [{
              value: 1,
              title: '1-Jul-15'
            },{
              value: 2,
              title: '2-Jul-15'
            },{
              value: 3,
              title: '3-Jul-15'
            },{
              value: 8,
              title: '4-Jul-15'
            },{
              value: 5,
              title: '5-Jul-15'
            },{
              value: 3,
              title: '6-Jul-15'
            },{
              value: 7,
              title: '7-Jul-15'
            },]
          },{
            title: 'May 29 - Jun 22, 2018',
            data: [{
              value: 11,
              title: '1-Jun-15'
            },{
              value: 2,
              title: '2-Jun-15'
            },{
              value: 13,
              title: '3-Jun-15'
            },{
              value: 18,
              title: '4-Jun-15'
            },{
              value: 5,
              title: '5-Jun-15'
            },{
              value: 13,
              title: '6-Jun-15'
            },{
              value: 17,
              title: '7-Jun-15'
            },]
          }]
        }}
        /// Aditional -- Option property, renders third chart (second line chart) at the bottom
        additional={{
          title: 'Aum Dinamics',
          subheaders: [{
            value: '100B $',
            title: 'AUM',
            state: 'normal'
          },{
            value: '13B $',
            title: 'Earning',
            state: 'bad'
          },{
            value: '13.1%',
            title: 'Change (1y)',
            state: 'good'
          }],
          datasets: [{
            title: 'Jun 22 - Jul 16, 2018',
            data: [{
              value: 1,
              title: '1-Jun-15'
            },{
              value: 2,
              title: '2-Jun-15'
            },{
              value: 3,
              title: '3-Jun-15'
            },{
              value: 8,
              title: '4-Jun-15'
            },{
              value: 5,
              title: '5-Jun-15'
            },{
              value: 3,
              title: '6-Jun-15'
            },{
              value: 7,
              title: '7-Jun-15'
            },]
          }]
        }}
      />

*/




import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import LevDate from '../LevDate.jsx';
import Select from '../Select.jsx';
import { PieChart, LineChart } from 'react-easy-chart';

let pieColors = ['#00ccf1', '#ffc070', '#39a9dc', '#071e40'];

for (let i = 0; i < 5; i++)
  pieColors = pieColors.concat(pieColors);

class SuperPie extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectOption: 0
    }
  }
  render() {
    return  <div className="pie-chart-box">
              <div className="row">
                <h2>{this.props.title}</h2>
                {this.props.datasets.length > 1 ?
                  <Select
                    value={this.props.datasets[this.state.selectOption].title}
                    options={this.props.datasets.map(dataset => dataset.title)}
                    setValue={(value) => {
                      for (let i in this.props.datasets)
                        if (this.props.datasets[i].title === value) {
                          this.setState({selectOption: i});
                          break;
                        }
                    }}
                   />: ''}
              </div>
              <div className="row">
                <PieChart
                  size={180}
                  innerHoleSize={140}
                  data={this.props.datasets[this.state.selectOption].data.map((chunk, i) => {
                    return {
                      key: chunk.header,
                      value: chunk.value,
                      color: pieColors[i]
                    }
                  })}
                />
                {this.props.datasets[this.state.selectOption].inCircleTitle ? <div className="pie-chart-in-circle-container">
                  <h3>{this.props.datasets[this.state.selectOption].inCircleValue || this.props.datasets[this.state.selectOption].data.reduce((a, b) => a + b.value, 0)}</h3>
                  <p>{this.props.datasets[this.state.selectOption].inCircleTitle}</p>
                </div> : ''}
              </div>
              <div className="row">
                {this.props.datasets[this.state.selectOption].data.map((chunk, i) => {
                  return <div key={i} className="pie-chart-subheader">
                    <div className="pie-chart-subheader-color" style={{backgroundColor: pieColors[i]}}></div>
                    <div className="pie-chart-subheader-title">{chunk.header}</div>
                  </div>
                })}
              </div>
            </div>
  }
}

class SuperLine extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectOption: 0
    }
  }
  render() {
    return  <div className="box line-chart-box">
              <div className="row">
                <h2>{this.props.title}</h2>
                {this.props.datasets.length > 1 ?
                  <Select
                    value={this.props.datasets[this.state.selectOption].title}
                    options={this.props.datasets.map(dataset => dataset.title)}
                    setValue={(value) => {
                      for (let i in this.props.datasets)
                        if (this.props.datasets[i].title === value) {
                          this.setState({selectOption: i});
                          break;
                        }
                    }}
                   />: ''}
              </div>
              <div className="row line-chart-subheaders">
                {this.props.subheaders.map((subheader, i) => <div key={i} className="line-chart-subheader">
                  <h3 style={{color: subheader.state === 'good' ? '#47bf6f' : (subheader.state === 'bad' ? '#f7080a' : '#071e40')}}>{subheader.value}</h3>
                  <p>{subheader.title}</p>
                </div>)}
              </div>
              <div className="row">
                <LineChart
                  xType={'time'}
                  yTicks={5}
                  xTicks={this.props.datasets[this.state.selectOption].data.length}
                  axes
                  margin={{top: 20, right: 10, bottom: 25, left: 20}}
                  grid
                  verticalGrid
                  interpolate={'cardinal'}
                  width={this.props.width}
                  height={300}
                  data={[this.props.datasets[this.state.selectOption].data.map((chunk, i) => {
                    return {
                      x: chunk.title,
                      y: chunk.value
                    }
                  })]}
                />
              </div>
            </div>
  }
}

export default class Graphics extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div className="grapics-boxes-container">
          <SuperPie
            title={this.props.pie.title}
            datasets={this.props.pie.datasets}
          />
          <SuperLine
            title={this.props.main.title}
            width={580}
            subheaders={this.props.main.subheaders || []}
            datasets={this.props.main.datasets}
          />
        </div>
        {!this.props.additional ? '' : 
          <div className="box margin-box">
            <SuperLine
              title={this.props.additional.title}
              width={800}
              subheaders={this.props.additional.subheaders || []}
              datasets={this.props.additional.datasets}
            />
            </div>}
      </div>)
  }
}
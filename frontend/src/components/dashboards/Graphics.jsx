
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


const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import LevDate from '../LevDate.jsx';
import Select from '../Select.jsx';
import { PieChart, LineChart } from 'react-easy-chart';

let colors = ['#0378ff', '#00ccf1', '#ffc070', '#39a9dc', '#071e40'];

for (let i = 0; i < 5; i++)
  colors = colors.concat(colors);

class SuperPie extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectOption: 0
    }
  }
  render() {
    const pieData = this.props.datasets[this.state.selectOption].data.map((chunk, i) => {
                    return {
                      key: chunk.header,
                      value: chunk.value,
                      color: colors[i]
                    }
                  })
    return  <div className="pie-chart-box" key={this.props.key ? this.props.key : ''}>
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
              <div className="row">
                <PieChart
                  size={this.props.size}
                  innerHoleSize={this.props.size - 40}
                  data={pieData}
                />
                {this.props.datasets[this.state.selectOption].inCircleTitle ? <div className="pie-chart-in-circle-container">
                  <h3>{this.props.datasets[this.state.selectOption].inCircleValue || this.props.datasets[this.state.selectOption].data.reduce((a, b) => a + b.value, 0)}</h3>
                  <p>{this.props.datasets[this.state.selectOption].inCircleTitle}</p>
                </div> : ''}
              </div>
              <div className="row">
                {this.props.datasets[this.state.selectOption].data.map((chunk, i) => {
                  return <div key={i} className="pie-chart-subheader">
                    <div className="pie-chart-subheader-color" style={{backgroundColor: colors[i]}}></div>
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
      viewOption: 1
    }
    this.viewOptions = ['Week', 'Month', 'Year']
    this.viewOptionsValues = {
      Week: 7,
      Month: 30,
      Year: 365,
    }
  }
  render() {
    let lineData = []
    lineData = this.props.datasets.map((dataset) => {
        return dataset.data.map(chunk => {
          return {
            x: /^[0-9]{1,2}-[a-zA-Z]{3}-[0-9]{2}$/.test(chunk.title) ? chunk.title : `${new Date(chunk.title).getDate()}-${monthNames[new Date(chunk.title).getMonth()]}-${new Date(chunk.title).getFullYear().toString().substr(2)}`,
            y: chunk.value
          }
        })
      })
    lineData = lineData.map(line => {
      const pervDayDate = new LevDate()
      pervDayDate.addDay(-1)
      const yesterday = pervDayDate.day() + '-' + (pervDayDate.monthStringShort()).substr(0, 1).toUpperCase() + (pervDayDate.monthStringShort()).substr(1) + '-' + pervDayDate.year().toString().substr(2)
      if (line.length === 0)
        line.push({
          x: yesterday,
          y: 0
        })
      if (line.length === 1) 
        line.unshift({
          x: yesterday,
          y: 0
        })
      // for (let i = 0; i < 500; i++) {
      //   pervDayDate.addDay(-1)
      //   const thisDay = pervDayDate.day() + '-' + (pervDayDate.monthStringShort()).substr(0, 1).toUpperCase() + (pervDayDate.monthStringShort()).substr(1) + '-' + pervDayDate.year().toString().substr(2)
      //   line.unshift({
      //     x: thisDay,
      //     y: 0
      //   })
      // }
      return line
    })
    let viewOptions = [], viewOption = this.state.viewOption
    if (lineData[0]) {
      for (let option of this.viewOptions) {
        if (this.viewOptionsValues[option] < lineData[0].length)
          viewOptions.push(option)
      }
      viewOptions.push('All')
      if (viewOption >= viewOptions.length)
        viewOption = viewOptions.length - 1
      if (viewOptions[viewOption] !== 'All') {
        console.log(-this.viewOptionsValues[viewOptions[viewOption]])
        lineData.forEach((line, i) => {
          lineData[i] = line.slice(0, this.viewOptionsValues[viewOptions[viewOption]])
        })
        // lineData = lineData.map((line) => {return line.slice(this.viewOptionsValues[viewOptions[viewOption]]) * -1})
        // console.log(lineData[0].length, this.viewOptionsValues[viewOptions[viewOption]])
      }
    }
    console.log(lineData)
    return  <div className="box line-chart-box" key={this.props.key ? this.props.key : ''}>
                <h2>{this.props.title}</h2>
                <div className="row line-chart-subheaders">
                  {this.props.subheaders.map((subheader, i) => <div key={i} className="line-chart-subheader">
                    <h3 style={{color: subheader.state === 'good' ? '#47bf6f' : (subheader.state === 'bad' ? '#f7080a' : '#071e40')}}>{subheader.value}</h3>
                    <p>{subheader.title}</p>
                  </div>)}
                </div>
                <div className="row">
                {viewOptions.length > 1 ?
                  <Select
                    value={viewOptions[viewOption]}
                    options={viewOptions}
                    setValue={(value) => this.setState({viewOption: viewOptions.indexOf(value)})}
                   />: ''}
                {this.props.datasets[0] && this.props.datasets[0].title ?<div className="line-chart-markers">{
                  this.props.datasets.map((dataset, i) => <div key={i} className="line-chart-marker"><span style={{backgroundColor: colors[i]}} />{dataset.title}</div>)
                }</div>: ''}
                </div>
              <div className="row">
                <LineChart
                  xTicks={Math.round(this.props.width / 60)}
                  xType={'time'}
                  axes
                  margin={{top: 20, right: 20, bottom: 45, left: 40}}
                  grid
                  verticalGrid
                  interpolate={'basis'}
                  width={this.props.width}
                  height={300}
                  data={lineData}
                />
              </div>
              {/*
              Interpolations:
                linear
                stepBefore
                stepAfter
                basis
                basisOpen
                basisClosed
                bundle
                cardinal
                cardinalOpen
                cardinalClosed
                natural
                monotoneX
                monotoneY
              */}
            </div>
  }
}

export default class Graphics extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    // console.log(this.props.graphics)
    if (!this.props.graphics)
      return 'No graphics property provided'
    const page = []
    let key = 0
    let obviousProperties = [],
    obviousPropertiesForLine = [],
    obviousPropertiesForPie = []
    for (let graphic of this.props.graphics) {
      switch (graphic.type) {
        case 'line':
          obviousProperties = ['title', 'lines']
          if (obviousProperties.some(property => graphic[property] === undefined))
            return <p>Error, no property {obviousProperties.find(property => graphic[property] === undefined)} for graphic #{(key)}</p>
          page.push(<SuperLine
                      key={graphic.title}
                      title={graphic.title}
                      width={800}
                      subheaders={graphic.subheaders || []}
                      datasets={graphic.lines}
                    />)
        break
        case 'pie':
          obviousProperties = ['title', 'datasets']
          if (obviousProperties.some(property => graphic[property] === undefined))
            return <p>Error, no property {obviousProperties.find(property => graphic[property] === undefined)} for graphic #{(key)}</p>
          page.push(<SuperPie
                      title={graphic.title}
                      datasets={graphic.datasets}
                      size={700}
                    />)
        break
        case 'pie-line':
          obviousPropertiesForLine = ['title', 'lines']
          if (obviousPropertiesForLine.some(property => graphic.line[property] === undefined))
            return <p>Error, no property {obviousPropertiesForLine.find(property => graphic.line[property] === undefined)} for graphic #{(key)}</p>
          obviousPropertiesForPie = ['title', 'datasets']
          if (obviousPropertiesForPie.some(property => graphic.pie[property] === undefined))
            return <p>Error, no property {obviousPropertiesForPie.find(property => graphic.pie[property] === undefined)} for pie graphic #{(key)}</p>
          page.push(<div className="grapics-boxes-container" key={graphic.pie.title + '-' + graphic.line.title}>
                      <SuperPie
                        title={graphic.pie.title}
                        datasets={graphic.pie.datasets}
                        size={180}
                      />
                      <SuperLine
                        title={graphic.line.title}
                        width={600}
                        subheaders={graphic.line.subheaders || []}
                        datasets={graphic.line.lines}
                      />
                    </div>)
        break
        case 'fixed-width-line':
          obviousProperties = ['title', 'lines', 'width']
          if (obviousProperties.some(property => graphic[property] === undefined))
            return <p>Error, no property {obviousProperties.find(property => graphic[property] === undefined)} for graphic #{(key)}</p>
          page.push(<SuperLine
                      key={graphic.title}
                      title={graphic.title}
                      width={graphic.width}
                      subheaders={graphic.subheaders || []}
                      datasets={graphic.lines}
                    />)
        break
        default:
          page.push(<p key={graphic.title}>Wrong type property for graphic #{(key)}</p>)
      }
      key++
    }
    // console.log(page)
    return <React.Fragment>{page}</React.Fragment>
    // return  <div>
    //           {!this.props.additional ? '' :
    //             <div className="box margin-box">
    //               <SuperLine
    //                 title={this.props.additional.title}
    //                 width={800}
    //                 subheaders={this.props.additional.subheaders || []}
    //                 onOneGraphic={this.props.additional.onOneGraphic}
    //                 datasets={this.props.additional.datasets}
    //               />
    //               </div>}
    //           <div className="grapics-boxes-container">
    //             <SuperPie
    //               title={this.props.pie.title}
    //               datasets={this.props.pie.datasets}
    //             />
    //             <SuperLine
    //               title={this.props.main.title}
    //               width={580}
    //               subheaders={this.props.main.subheaders || []}
    //               onOneGraphic={this.props.main.onOneGraphic}
    //               datasets={this.props.main.datasets}
    //             />
    //           </div>
    //         </div>
  }
}

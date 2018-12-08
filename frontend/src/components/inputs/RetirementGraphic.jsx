import React, { Component } from 'react'
import { AreaChart } from 'react-easy-chart'
import Input from './Input'

import '../../css/RetirementGraphic.sass'


class RetirementGraphic extends Component {
  constructor(props) {
    super(props)
    if (this.props.value) {
      try {
        this.state = JSON.parse(this.props.value)
      } catch(e) {
        this.state = {age: '', length: ''}
      }
    } else {
      this.state = {age: 65, length: 10}
    }
  }

  render() {
    let graphicData = [{
      x: ((new Date).getFullYear()),
      y: 0
    }]
    if (this.state.age - this.props.age && this.state.length && this.state.age - this.props.age <= 150 && this.state.length <= 150) {
      graphicData.push({
        x: (new Date).getFullYear() + this.state.age * 1 - this.props.age,
        y: 100
      }, {
        x: (new Date).getFullYear() + this.state.age * 1 - this.props.age + this.state.length * 1 + 20,
        y: 80
      })
      graphicData.push({
        x: (new Date).getFullYear() + this.state.age * 1 - this.props.age + this.state.length * 1 + 46,
        y: 20
      })
    }
    if (graphicData.length === 1)
      graphicData.push({
        x: graphicData[0].x + 10,
        y: graphicData[0].y
      })
    if (graphicData.length > 1) {
      const xTicks = 16
      const tickSize = (graphicData[graphicData.length - 1].x - graphicData[0].x) / xTicks
      const pointsByYears = []
      for (let lastPoint = 0; lastPoint < graphicData.length; lastPoint++) {
        const prevPoint = graphicData[lastPoint] 
        const nextPoint = graphicData[lastPoint + 1]
        if (nextPoint === undefined)
          break
        for (let year = prevPoint.x; year < nextPoint.x; year++) {
          const y = prevPoint.y + (nextPoint.y - prevPoint.y) * (((nextPoint.x - prevPoint.x) - (nextPoint.x - year)) / (nextPoint.x - prevPoint.x))
          pointsByYears.push({
            x: year,
            y
          })
        }
        pointsByYears.push({
          x: nextPoint.x,
          y: nextPoint.y
        })
      }

      graphicData = []
      for (let i = 0; i < xTicks; i++) {
        const thisPoint = pointsByYears[Math.floor(((xTicks - (i + 1)) / (xTicks)) * pointsByYears.length)]
        if (thisPoint === undefined) {
          console.log(i, xTicks, pointsByYears.length, (xTicks - (i + 1)) / (xTicks))
          return <p>fail</p>
        }
        let spaceName = ''
        for (let k = 0; k < thisPoint.x; k++)
          spaceName += ' '
        if (i % 2 === 0)
          graphicData.push(thisPoint)
        else
          graphicData.push({
            y: thisPoint.y,
            x: spaceName
          })
      }
    }
    graphicData.reverse()
    return <React.Fragment>
      <div className="row retirement-graphic-container">
        <h2>Pension Planning Schedule</h2>
        {graphicData.length > 1 ?
          <AreaChart
            axes
            yTicks={6}
            xType={'text'}
            grid
            verticalGrid
            margin={{top: 15, right: 40, bottom: 50, left: 70}}
            width={940}
            interpolate={'basis'}
            height={376}
            data={[graphicData]}
            />
          : <div style={{height: 376}} />}
      </div>
      <div className="row">
        <div className="inline-input-container">
          <div className="row">
            <small>Retirement age</small>
          </div>
          <input
            value={this.state.age}
            onChange={event => {
              let number = event.target.value.replace(/[^0-9]/g, '');
              if (number == "")
                number = undefined;
              if (number > 150)
                number = 150
              if (number < 0)
                number = 1
              this.props.setValue(JSON.stringify(Object.assign(this.state, {age: number})))
              this.setState({age: number});
            }}
          />
        </div>
        <div className="inline-input-container">
          <div className="row">
            <small>Retirement length</small>
          </div>
          <input
            value={this.state.length}
            onChange={event => {
              let number = event.target.value.replace(/[^0-9]/g, '');
              if (number == "")
                number = undefined;
              if (number > 150)
                number = 150
              if (number < 0)
                number = 1
              this.props.setValue(JSON.stringify(Object.assign(this.state, {length: number})))
              this.setState({length: number});
            }}
          />
        </div>
      </div>
    </React.Fragment>
  }
}

export default RetirementGraphic

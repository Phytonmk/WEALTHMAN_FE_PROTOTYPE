import React, { Component } from 'react'

import '../css/Qsign.sass';
import pic from '../img/get-info-icon.svg'

// Usage example
// all props are optional
// <QSign tooltip="Lorem ipsum" className="className"/>


class QSign extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      areaHeight: 0,
      leftOffset: 0,
      offsetsSet: false,
      cornerOffset: 0
    }
  }
  calcOffset(container) {
    if (!container || !container.children[1] || this.state.offsetsSet)
      return
    const containerOffsets = container.getBoundingClientRect()
    const bodyOffsets = document.body.getBoundingClientRect()
    let left = -1 * container.children[1].children[2].clientWidth / 2
    if (containerOffsets.left - container.children[1].children[2].clientWidth / 2 < bodyOffsets.left) {
      left = bodyOffsets.left - containerOffsets.left
    }
    if (container.children[1].children[2].clientWidth + containerOffsets.left > bodyOffsets.width) {
      left = -1 * (container.children[1].children[2].clientWidth) + 20//container.children[1].children[2].clientWidth
    }
    this.setState({
      areaHeight: container.children[1].children[2].clientHeight + 28,
      offsetsSet: true,
      leftOffset: left,
    })
  }
  render() {
    const tooltip = this.props.tooltip || ''
    return <div
              className={this.props.className ? "question-icon " + this.props.className : "question-icon"}
              ref={(container => this.calcOffset(container))}
              onMouseOver={() => {this.setState({visible: true})}}
              onMouseOut={() => this.setState({visible: false})}>
      <img src={pic} />
      <div className={this.state.visible && tooltip !== '' ? "animation-container visible" : "animation-container"}>
        <div className="mouse-holder" style={{height: this.state.areaHeight, left: this.state.leftOffset}}/>
        <div className="corner"/>
        <div className="tooltip" style={{left: this.state.leftOffset}}>{tooltip}</div>
      </div>
    </div>
  }
}

export default QSign
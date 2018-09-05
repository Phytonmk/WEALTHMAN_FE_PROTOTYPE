import React, { Component } from 'react'

import pic from '../img/question-icon.png'

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
    return <div
              className="question-icon"
              ref={(container => this.calcOffset(container))}
              onMouseOver={() => {this.setState({visible: true})}}
              onMouseOut={() => this.setState({visible: false})}>
      <img src={pic} />
      {this.props.tooltip ?
        <div className={this.state.visible ? "animation-container visible" : "animation-container"}>
          <div className="mouse-holder" style={{height: this.state.areaHeight, left: this.state.leftOffset}}/>
          <div className="corner"/>
          <div className="tooltip" style={{left: this.state.leftOffset}}>{this.props.tooltip}</div>
        </div>
      : ''}
    </div>
  }
}

export default QSign
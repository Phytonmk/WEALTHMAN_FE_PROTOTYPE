import React, { Component } from 'react';
import ReactDOM from "react-dom";

import '../css/Seemore.sass';

{/*
  //  //  //              USAGE EXAMPLE              //  //  //

<Seemore
  //(OPTIONAL) true if accordion is opened, when first rendered (default false)
  opened={true}
  //(OPTIONAL) closed element height (default 300px)
  minHeight="200px"
/>
*/}

const defaultMinHeigh = 200;

class Seemore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: this.props.opened ? this.props.opened : false,
      maxHeight: 0,
    };
  }

  componentDidMount() {
    let content = ReactDOM.findDOMNode(this);
    if (content instanceof HTMLElement) {
      content = content.getElementsByClassName("content")[0].getBoundingClientRect();
      this.setState({maxHeight: content.bottom - content.top});
    }
  }

  render() {
    return (
      <article className={"show-more " + (this.state.opened ? "opened" : "")} >
        <div
          className="collapsable-area"
          style={{maxHeight: (this.state.opened ? this.state.maxHeight : defaultMinHeigh)}}
        >
          <div className="content">
            {this.props.children}
          </div>
        </div>
        <button className="toggle" onClick={() => this.setState({opened: !this.state.opened})}>
	        <h2>SEE {this.state.opened ? "LESS" : "MORE"}</h2>
        </button>
      </article>
    );
  }
}

export default Seemore;

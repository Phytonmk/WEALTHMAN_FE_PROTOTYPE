import React, { Component } from 'react';
import ReactDOM from "react-dom";

import '../css/Accordion.sass';

{/*
  //  //  //              USAGE EXAMPLE              //  //  //

<Accordion
  //(OPTIONAL) header of the accordion
  header={"hi"}
  //(OPTIONAL) content of the accordion
  content={"long time no see"}
  //(OPTIONAL) true if accordion is opened, when first rendered (default false)
  opened={true}
  //(OPTIONAL) width of the element (default 100%)
  width="135px"
/>
*/}

class Accordion extends Component {
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
      <article
        className={"accordion " + (this.state.opened && "opened")}
        style={{width: (this.props.width ? this.props.width : "100%")}}
      >
        <h2 onClick={() => this.setState({opened: !this.state.opened})}>
          {this.props.header}
        </h2>
        <div
          className="collapsable-area"
          style={{maxHeight: (this.state.opened ? this.state.maxHeight : 0)}}
        >
          <div className="content">
            {this.props.content}
          </div>
        </div>
      </article>
    );
  }
}

export default Accordion;

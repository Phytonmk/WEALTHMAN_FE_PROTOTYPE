import React, { Component } from 'react';

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
      opened: false,
    }
  }

  componentWillMount() {
    if (typeof this.props.opened != "undefined")
      this.setState({opened: this.props.opened});
  }

  render() {
    return (
      <article
        className={"accordion " + (this.state.opened ? "opened" : "")}
        style={{width: (this.props.width ? this.props.width : "100%")}}
      >
        <h2 onClick={() => this.setState({opened: !this.state.opened})}>
          {this.props.header}
        </h2>
        <div className="content">
          {this.props.content}
        </div>
      </article>
    );
  }
}

export default Accordion;

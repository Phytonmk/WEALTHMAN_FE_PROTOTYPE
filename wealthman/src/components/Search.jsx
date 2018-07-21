import React, { Component } from 'react';

import '../css/Search.sass';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ""
    }
  }

  componentWillMount() {
    if (typeof this.props.value == "undefined")
      this.setState({error: this.state.error + "you must define 'value' prop; "});
    if (typeof this.props.setValue == "undefined")
      this.setState({error: this.state.error + "you must define 'setValue' prop; "});
  }

  render() {
    if (this.state.error != "")
      return "error: " + this.state.error;
    return (
      <div className="search-field">
        <button className="search" />
        {
          this.props.value != "" ?
            <button className="cancel" onClick={() => this.props.setValue("")} />
            : ""
        }
        <input
          type="text"
          value={this.props.value}
          onChange={(event) => this.props.setValue(event.target.value)}
          placeholder="Search..." />
      </div>
    );
  }
}

export default Search;

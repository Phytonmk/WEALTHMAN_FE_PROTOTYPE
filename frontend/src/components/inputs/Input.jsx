import React, { Component } from 'react';

import '../../css/Input.sass';

{/*
  //  //  //              USAGE EXAMPLE              //  //  //

<Input
  //(REQUIRED) value to show
  value={this.state.password}
  //(OPTIONAL) function that sets the value
  setValue={(value) => this.setState({password: value})}
  //(OPTIONAL) function that listen to changes
  onChange={(event) => this.setState({password: event.target.value})}
  //(OPTIONAL) type of the input (text or password for now) (! Also you can use type="textarea" and "switcher" !)
  type={"password"}
  //(OPTIONAL) placeholder for the input
  placeholder={"enter password"}
  //(OPTIONAL) tabindex for the input
  tabindex={1}
  //(OPTIONAL) error message when value is incorrect (if error undefined, field is normal, if error is "" or anything else, field is red)
  error={this.state.incorrectPassword ? "incorrect password" : undefined}
/>
*/}

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    if (this.props.type === 'textarea')  
      return (
        <textarea
          value={this.props.value}
          onChange={(event) => {
            if (typeof this.props.onChange === 'function')
              this.props.onChange(event)
            if (typeof this.props.setValue === 'function')
              this.props.setValue(event.target.value)
          }}
          type={this.props.type}
          placeholder={this.props.placeholder}
          className={"default " + (this.props.error ? "error" : "")}
          tabIndex={this.props.tabindex}
        />
      );
    else if (this.props.type === 'switcher')  
      return (
        <div className="switch-container">
          <input
            checked={this.props.value}
            onChange={(event) => {
              if (typeof this.props.onChange === 'function')
                this.props.onChange(event)
              if (typeof this.props.setValue === 'function')
                this.props.setValue(event.target.checked)
            }}
            type="checkbox"
            placeholder={this.props.placeholder}
            className={"default " + (this.props.error ? "error" : "")}
            tabIndex={this.props.tabindex}
          />
          <div className="switch-hollow">
            <div className="switch-button" />
          </div>
        </div>

      );
    else  
      return  <React.Fragment>
                {this.props.percentSymbol ? <span className="after-input-percent-symbol">%</span> : ''}
                <input
                  value={this.props.value}
                  onChange={(event) => {
                    if (typeof this.props.onChange === 'function')
                      this.props.onChange(event)
                    if (typeof this.props.setValue === 'function')
                      this.props.setValue(event.target.value)
                  }}
                  type={this.props.type}
                  placeholder={this.props.placeholder}
                  className={"default " + (this.props.error ? "error" : "")}
                  tabIndex={this.props.tabindex}
                />
              </React.Fragment>
  }
}

export default Input;

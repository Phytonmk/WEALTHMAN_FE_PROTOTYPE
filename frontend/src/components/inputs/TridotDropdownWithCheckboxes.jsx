import React, { Component } from 'react';
import $ from 'jquery';

import Checkbox from './Checkbox';
import '../../css/TridotDropdownWithCheckboxes.sass';

{/*
  //  //  //              USAGE EXAMPLE              //  //  //

<TridotDropdownWithCheckboxes
  //(REQUIRED) options of the select
  options={[
      {
        label: "A",
        value: false,
      },
      {
        label: "B",
        value: false,
      },
    ]}
  //(REQUIRED) function that sets the value
  setValue={(value) => this.setState({status: value})}
  //(OPTIONAL) width of the element
  width="135px"
  //(OPTIONAL) amount of shown options, others will be wisible after scroll (default 6)
  maxShown={5}
/>
*/}

class TridotDropdownWithCheckboxes extends Component {
  constructor(props) {
    super(props);

    let error = "";
    if (typeof props.options == "undefined")
      error += "you must define 'options' prop; ";
    if (typeof props.setValue == "undefined")
      error += "you must define 'setValue' prop; ";

    this.state = {
      opened: false,
      error: error,
    }
  }

  componentWillMount() {
    $(window).click(event => {
      if (!event.target.className.includes("tridot") && !event.target.className.includes("checkbox"))
        this.setState({opened: false});
    });
  }

  render() {
    if (this.state.error != "")
      return "error: " + this.state.error;
    return (
      <div className="tridot-dropdown">
				<button
					className="tridot"
					onClick={() => this.setState({opened: !this.state.opened})}
				/>
        {
          this.state.opened &&
					<div
						className="options"
						style={{
							width: (this.props.width ? this.props.width : ""),
							maxHeight: (this.props.maxShown ? (this.props.maxShown * 47 + 10 + "px") : (6 * 47 + 10 + "px")),
						}}
					>
						{
							this.props.options.map((option, index) =>
								<div className="option" key={option.label}>
									<Checkbox
										value={option.value}
										label={option.label}
										setValue={(value) => {
											let options = this.props.options;
											options[index].value = value;
											this.props.setValue(options);
										}}
									/>
								</div>
							)
						}
					</div>
        }
      </div>
    );
  }
}

export default TridotDropdownWithCheckboxes;

import React, { Component } from 'react';

import myDate from './myDate.jsx';
import '../css/Sortable2.css';

{/*
//  //  //              USAGE EXAMPLE              //  //  //

<Sortable2
  //(OPTIONAL) sort by this column, when table is shown for the first time
  initialSortBy={"name"}
  //(OPTIONAL) function to filter rows
  filter={row => true}
  //(OPTIONAL) define how to show columns
  columns={[
    {
      //(REQUIRED!) name of data property in this column
      property: "name",
      //(OPTIONAL) title of column
      title: "Manager name",
      //(OPTIONAL) width of column
      width: "206px",
      //(OPTIONAL) for correct sorting: string (default), number, date (as string), unsortable
      type: "string",
      //(OPTIONAL) tooltip shown for title
      tooltip: "",
    },
  ]}
  //(OPTIONAL) data to show
  data={this.state.managers.map(manager => {
    return {
      //send id for correct <li key={id}>
      id: manager.id,
      //define simple data
      name: manager.name + " " + manager.surname,
      //define jsx-object data, wich can be sorted
      rating: {
        //this will be rendered to the column cell
        render: <div className="rating">{manager.rating}</div>,
        //will be sorted by that property
        sortBy: {manager.rating}
      }
    };
  })}
/>
*/}

class Sortable2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: -1,
      order: false,
      error: undefined,
      rowProperties: undefined,
    }
  }

  componentWillMount() {
    if (!((this.props.columns && this.props.columns.length > 0))) {
      this.setState({error: "no columns"});
      return;
    }
    if (!((this.props.data && this.props.data.length > 0))) {
      this.setState({error: "no data"});
      return;
    }
    //DEBBAGING: comment when finished
    this.props.columns.forEach(column => {
      if (!this.props.data[0].hasOwnProperty(column.property)) {
        this.setState({error: "Error: rows doesn\'t have \"" + column.property + "\" property"});
        return;
      }
    });

    //set width for columns
    this.setState({
      rowProperties: this.props.columns.map(column => {
        return {
          name: column.property,
          width: (column.width ? column.width : (99 / this.props.columns.length) + "%"),
        };
      })
    });
    //set sortBy
    if (this.props.InitialSortBy)
      this.setState({sortBy: this.props.sortBy});
    else {
      let firstSortableColumn = this.props.columns.find(column => column.type != "unsortable");

      if (firstSortableColumn)
        this.setState({sortBy: firstSortableColumn.property});
    }
  }

  setSortBy(sortBy) {
    if (this.props.columns.find(column => column.property == sortBy).type == "unsortable")
      return;
    if (this.state.sortBy == sortBy)
      this.setState({ order: !this.state.order });
    else
      this.setState({ sortBy: sortBy });
  }

  renderListings() {
    return (
      <ul className="listings">
        {
          this.props.data
          .filter(this.props.filter)
          .sort((a, b) => {
            let sortableA = a[this.state.sortBy].hasOwnProperty("render") && a[this.state.sortBy].hasOwnProperty("sortBy") ?
              a[this.state.sortBy].hasOwnProperty("sortBy") : a[this.state.sortBy];
            let sortableB = b[this.state.sortBy].hasOwnProperty("render") && b[this.state.sortBy].hasOwnProperty("sortBy") ?
              b[this.state.sortBy].hasOwnProperty("sortBy") : b[this.state.sortBy];

            switch (this.props.columns.find(column => column.property == this.state.sortBy).type) {
              case "number":
                return this.state.order ? Number(sortableA) < Number(sortableB) : Number(sortableA) > Number(sortableB);
              case "date":
                let dateA = new myDate(sortableA);
                return this.state.order ? dateA.less(sortableB) : !dateA.less(sortableB);
              case "unsortable":
                return true;
              default:
                return this.state.order ? sortableA < sortableB : sortableA > sortableB;
            }
          })
          .map(row => this.renderListing(row))
        }
      </ul>
    );
  }
  renderListing(row) {
    return (
      <li className="listing" key={row.id}>
        {
          this.state.rowProperties.map((property, index) => {
            let cell = row[property.name];
            if (typeof cell == "undefined") {
              console.log(property.name);
            }
            return (
              <div
                className={"cell " + (index == this.state.rowProperties.length - 1 ? "last" : "")}
                style={{width: property.width}}
              >
                {(cell.hasOwnProperty("render") && cell.hasOwnProperty("sortBy") ? cell.render : cell)}
              </div>
            );
          })
        }
      </li>
    );
  }

  renderHeader() {
    return (
      <div className="header">
        {
          this.props.columns.map((column, index) =>
            <div
              className={"cell " + (index == this.state.rowProperties.length - 1 ? "last" : "")}
              style={{"width": this.state.rowProperties[index].width}}
            >
              <span
                className={(column.type == "unsortable" ? "unsortable" : "") + (this.state.sortBy === column.property ? (this.state.order ? "asc" : "desc") : "")}
                onClick={() => this.setSortBy(column.property)}
              >
                {column.title}
              </span>
            </div>
          )
        }
      </div>
    );
  }

  render() {
    if (this.state.error)
      return (
        <div className="sortable">
          <ul className="listings">
            {this.state.error}
          </ul>
        </div>
      );

    return (
      <div className="sortable">
        {this.renderHeader()}
        {this.renderListings()}
      </div>
    );
  }
}

export default Sortable2;

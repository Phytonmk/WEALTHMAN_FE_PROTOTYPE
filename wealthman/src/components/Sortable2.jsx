import React, { Component } from 'react';

import myDate from './myDate.jsx';
import '../css/Sortable2.sass';

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
        value: {manager.rating}
      }
    };
  })}
  //(OPTIONAL) show navigational arrows (may overlay content in right corner of the header)
  navigation={true}
  //(OPTIONAL) maximum shown rows (default 10)
  maxShown={5}
/>
*/}

class Sortable2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: -1,
      order: false,
      offset: 0,
      maxShown: 10,
      error: undefined,
      rowProperties: undefined,
    }
  }

  componentWillMount() {
    if (!(this.props.columns && this.props.columns.length > 0)) {
      this.setState({error: "no columns"});
      return;
    }
    if (!(this.props.data && this.props.data.length > 0)) {
      this.setState({error: "no data"});
      return;
    }
    //FOR DEBBAGING PURPOSES: comment this when finished
    this.props.columns.forEach(column => {
      if (!this.props.data[0].hasOwnProperty(column.property)) {
        this.setState({error: "Error: rows doesn\'t have \"" + column.property + "\" property"});
        return;
      }
    });
    if (!this.props.data[0].hasOwnProperty("id")) {
      this.setState({error: "data objects doesn't have id"});
      return;
    }

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

    if (this.props.maxShown)
      this.setState({maxShown: this.props.maxShown});
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
          .filter(this.props.filter ? this.props.filter : i => true)
          .sort((a, b) => {
            let sortableA = a[this.state.sortBy].hasOwnProperty("render") && a[this.state.sortBy].hasOwnProperty("value") ?
              a[this.state.sortBy].value : a[this.state.sortBy];
            let sortableB = b[this.state.sortBy].hasOwnProperty("render") && b[this.state.sortBy].hasOwnProperty("value") ?
              b[this.state.sortBy].value : b[this.state.sortBy];

            switch (this.props.columns.find(column => column.property == this.state.sortBy).type) {
              case "number":
                // alert(sortableA + sortableB);
                return this.state.order ? Number(sortableA) - Number(sortableB) : Number(sortableB) - Number(sortableA);
              case "date":
                let dateA = new myDate(sortableA);
                return this.state.order ? dateA.less(sortableB) : !dateA.less(sortableB);
              case "unsortable":
                return true;
              default:
                return this.state.order ? String(sortableA).localeCompare(String(sortableB)) : String(sortableB).localeCompare(String(sortableA));
            }
          })
          .slice(this.state.offset, this.state.offset + this.state.maxShown)
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
              console.log('undefined cell in sortable2: ' + property.name);
              return <div className="cell" />;
            }
            return (
              <div
                className={"cell " + (index == this.state.rowProperties.length - 1 ? "last" : "")}
                style={{width: property.width}}
              >
                {(cell.hasOwnProperty("render") && cell.hasOwnProperty("value") ? cell.render : (cell))}
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
              title={column.tooltip ? column.tooltip : column.title}
            >
              {
                typeof column.title == "string" ?
                  <span
                    className={(column.type == "unsortable" ? "unsortable" : "") + (this.state.sortBy === column.property ? (this.state.order ? "asc" : "desc") : "")}
                    onClick={() => this.setSortBy(column.property)}
                  >
                    {column.title}
                  </span>
                :
                  column.title
              }
            </div>
          )
        }
        {this.props.navigation ? this.renderNavigation() : ""}
      </div>
    );
  }

  renderNavigation() {
    let length = this.props.data.filter(this.props.filter ? this.props.filter : i => true).length;

    if (this.state.maxShown >= length)
      return;

    return (
      <div className="navigation">
        {
          this.state.offset > 0 ?
          <button
            className="left-arrow active"
            onClick={() => this.setState({
              offset: Math.max(this.state.offset - this.state.maxShown, 0),
              maxShown: Math.min(this.state.maxShown, this.state.offset)
            })}
          />
          :
          <button className="left-arrow" />
        }
        {
          this.state.offset + this.state.maxShown < length ?
          <button
            className="right-arrow active"
            onClick={() => this.setState({
              offset: Math.min(this.state.offset + this.state.maxShown, length - 1)
            })}
          />
          :
          <button className="right-arrow" />
        }
      </div>
    );
  }

  renderShowMore() {
    let length = this.props.data.filter(this.props.filter ? this.props.filter : i => true).length;

    if (this.state.offset + this.state.maxShown >= length)
      return;

    return (
      <button className="show-more" onClick={() => this.setState({
        maxShown: this.state.maxShown + (this.props.maxShown ? this.props.maxShown : 10)
      })}>
        SHOW MORE
      </button>
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
        {this.renderShowMore()}
      </div>
    );
  }
}

export default Sortable2;

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import LevDate from './LevDate';
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
      },
      //define link for entire listing (works when Sortable2 has propery "linkProperty")
      listingLink: "/manager/" + manager.id
    };
  })}
  //(OPTIONAL) show navigational arrows (may overlay content in right corner of the header)
  navigation={true}
  //(OPTIONAL) maximum shown rows (default 10)
  maxShown={5}
  //(OPTIONAL) listings become clicable links, links are taken from this property
  linkProperty={"listingLink"}
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
      rowProperties: undefined,
      error: "",
    }
    this.alreadyInitialized = false
  }

  componentWillMount() {
    this.initialize(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.initialize(nextProps);
  }

  columnsDefined(props) {
    return props.columns && props.columns.length > 0;
  }
  dataDefined(props) {
    return props.data && props.data.length > 0;
  }

  initialize(props) {
    //check for errors
    if (this.columnsDefined(props) && this.dataDefined(props)) {
      props.columns.forEach(column => {
        if (!props.data[0].hasOwnProperty(column.property))
          this.setState({error: this.state.error + "Error: data objects doesn\'t have \"" + column.property + "\" property; "});
      });
      if (!props.data[0].hasOwnProperty("id"))
        this.setState({error: this.state.error + "data objects doesn't have id; "});
      if (props.linkProperty && !props.data[0].hasOwnProperty(props.linkProperty))
        this.setState({error: this.state.error + "data objects doesn't have \"" + props.linkProperty + "\"property; "});
    }

    if (this.state.error != "" || !this.columnsDefined(props))
      return;

    //set width for columns
    this.setState({
      rowProperties: props.columns.map(column => {
        return {
          key: column.property,
          name: column.property,
          width: (column.width ? column.width : (99 / props.columns.length) + "%"),
        };
      })
    });

    //set sortBy
    if (!this.alreadyInitialized) {
      if (props.initialSortBy)
        this.setState({sortBy: props.initialSortBy});
      else {
        let firstSortableColumn = props.columns.find(column => column.type != "unsortable");

        if (firstSortableColumn)
          this.setState({sortBy: firstSortableColumn.property});
      }

      if (props.maxShown)
        this.setState({maxShown: props.maxShown});
    }

    this.alreadyInitialized = true
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
    if (!this.dataDefined(this.props))
      return <ul className="listings">
        <li className="listing">
          <div className="cell">no data</div>
        </li>
      </ul>;

    if (!this.columnsDefined(this.props))
      return <ul className="listings">
        <li className="listing">
          <div className="cell">no columns defined;</div>
        </li>
      </ul>;

    return (
      <ul className="listings">
        {
          this.props.data
          .filter(this.props.filter ? this.props.filter : (i) => true)
          .sort((a, b) => {
            let sortableA = a[this.state.sortBy].hasOwnProperty("render") && a[this.state.sortBy].hasOwnProperty("value") ?
              a[this.state.sortBy].value : a[this.state.sortBy];
            let sortableB = b[this.state.sortBy].hasOwnProperty("render") && b[this.state.sortBy].hasOwnProperty("value") ?
              b[this.state.sortBy].value : b[this.state.sortBy];

            switch (this.props.columns.find(column => column.property == this.state.sortBy).type) {
              case "number":
                return this.state.order ? Number(sortableA) - Number(sortableB) : Number(sortableB) - Number(sortableA);
              case "date":
                let dateA = new LevDate(sortableA);
                return this.state.order ? dateA.less(sortableB) : !dateA.less(sortableB);
              case "unsortable":
                return true;
              default:
                return this.state.order ? String(sortableA).localeCompare(String(sortableB)) : String(sortableB).localeCompare(String(sortableA));
            }
          })
          .slice(this.state.offset, this.state.offset + this.state.maxShown)
          .map(row => {
            if (this.props.linkProperty)
              return <Link to={row[this.props.linkProperty]} key={row.id}>
                {this.renderListing(row)}
              </Link>;
            return this.renderListing(row)
          })
        }
      </ul>
    );
  }
  renderListing(row) {
    return (
      <li className={"listing " + (this.props.linkProperty ? "clicable" : "")} key={row.id}>
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
                key={row.id + property.name}
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
    if (!this.columnsDefined(this.props))
      return <div className="header" />;

    return (
      <div className="header">
        {
          this.props.columns.map((column, index) =>
            <div
              className={"cell " + (index == this.state.rowProperties.length - 1 ? "last" : "")}
              style={{"width": this.state.rowProperties[index].width}}
              title={column.tooltip ? column.tooltip : column.title}
              key={"header" + column.property}
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
    let length = this.props.data.filter(this.props.filter ? this.props.filter : (i) => true).length;

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

  renderSeemore() {
    if (!this.columnsDefined(this.props) || !this.dataDefined(this.props))
      return;

    let length = this.props.data.filter(this.props.filter ? this.props.filter : (i) => true).length;

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
    if (this.state.error != "")
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
        {this.renderSeemore()}
      </div>
    );
  }
}

export default Sortable2;

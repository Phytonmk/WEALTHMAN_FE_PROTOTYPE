import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import TridotDropdownWithCheckboxes from './inputs/TridotDropdownWithCheckboxes'
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
      //(OPTIONAL) class for the column title
      titleClass: "border-left",
      //(OPTIONAL) class for the column cell
      cellClass: "border-left",
      //(OPTIONAL) columns with "true" will be static when listings scrolled horizontally (default "false")
      preventScroll: true,
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
      horizontalOffset: 0,
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
          titleClass: column.titleClass,
          cellClass: column.cellClass,
          preventScroll: column.preventScroll,
        };
      })
    });

    //set initial sortBy
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

    let scrollableRowColumns = this.props.columns
    .filter(column => !column.preventScroll)
    .filter(column => column.hasOwnProperty("title") && column.title != "");
    this.setState({
      shownColumns: scrollableRowColumns.map(column => ({
        key: column.property,
        label: column.title,
        value: true,
      }))
    });

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

  renderListings(rowProperties) {
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
                {this.renderListing(row, rowProperties)}
              </Link>;
            return this.renderListing(row, rowProperties)
          })
        }
      </ul>
    );
  }
  renderListing(row, rowProperties) {
    return (
      <li className={"listing " + (this.props.linkProperty ? "clicable" : "")} key={row.id}>
        {
          rowProperties.map((property, index) => {
            let cell = row[property.name];
            if (typeof cell == "undefined") {
              console.log('undefined cell in sortable2: ' + property.name);
              return <div className="cell" />;
            }
            return (
              <div
                className={"cell " +
                          (property.cellClass ? property.cellClass : "") + " " +
                          (index == rowProperties.length - 1 ? "last" : "")}
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

  renderHeader(rowProperties) {
    let columns = this.props.columns.filter(column => rowProperties.map(property => property.key).includes(column.property));

    if (!this.columnsDefined(this.props))
      return <div className="header" />;

    return (
      <div className="header">
        {
          columns.map((column, index) =>
            <div
              className={"cell " +
                        (rowProperties[index].titleClass ? rowProperties[index].titleClass : "") + " " +
                        (index == rowProperties.length - 1 ? "last" : "")}
              style={{"width": rowProperties[index].width}}
              title={column.tooltip ? column.tooltip : column.title}
              key={"header" + column.property}
            >
              {
                typeof column.title == "string" ?
                  <span
                    className={"noselect " +
                              (column.type == "unsortable" ? "unsortable" : "") +
                              (this.state.sortBy === column.property ? (this.state.order ? "asc" : "desc") : "")}
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
      </div>
    );
  }

  renderVerticalNavigation() {
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

  renderHorizontalNavigation() {
    const minShownCells = 3;
    let scrollablePropertiesLength = this.state.rowProperties.filter(property => !property.preventScroll).length;
    
    return (
      <div className="navigation">
        {
          this.state.horizontalOffset > 0 ?
          <button
            className="left-arrow active"
            onClick={() => this.setState({
              horizontalOffset: this.state.horizontalOffset - 1
            })}
          />
          :
          <button className="left-arrow" />
        }
        {
          scrollablePropertiesLength - this.state.horizontalOffset > minShownCells ?
          <button
            className="right-arrow active"
            onClick={() => this.setState({
              horizontalOffset: this.state.horizontalOffset + 1
            })}
          />
          :
          <button className="right-arrow" />
        }
      </div>
    );
  }

  renderShowmore() {
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

    let scrollableRowProperties = this.state.rowProperties
    .filter(property => !property.preventScroll)
    .filter(column => {
      let shownColumn = this.state.shownColumns.find(c => c.key == column.key);
      if (typeof shownColumn != "undefined")
        return shownColumn.value;
      return true;
    });
    let nonScrollableRowProperties = this.state.rowProperties
    .filter(property => property.preventScroll == true);
    scrollableRowProperties = scrollableRowProperties.slice(this.state.horizontalOffset);
    
    return (
      <div className="sortable">
        <div className="scrollable-properties-column">
          {this.renderHeader(scrollableRowProperties)}
          {this.renderListings(scrollableRowProperties)}
        </div>
        <div className="non-scrollable-properties-column">
          {this.renderHeader(nonScrollableRowProperties)}
          {this.renderListings(nonScrollableRowProperties)}
        </div>
        {this.renderHorizontalNavigation()}
        <TridotDropdownWithCheckboxes
          options={this.state.shownColumns}
          setValue={(value) => this.setState({shownColumns: value})}
        />
        {this.renderShowmore()}
      </div>
    );
  }
}

export default Sortable2;

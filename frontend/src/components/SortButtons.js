import React, { Component } from "react";

class SortButtons extends Component {
  sort = e => {
    this.props.sort(e);
  }

  render() {
    return (
      <div style={{ padding: "10px" }}>
        <div className="title">Sort by</div>
        <button name="sort_date" onClick={this.sort}>Date</button>
        <button name="sort_airline" onClick={this.sort}>Airline</button>
        <button name="sort_flight_number" onClick={this.sort}>Flight Number</button>
        <button name="sort_from" onClick={this.sort}>From</button>
        <button name="sort_to" onClick={this.sort}>To</button>
        <button name="sort_aircraft" onClick={this.sort}>Aircraft Type</button>
        <button name="sort_reg" onClick={this.sort}>Aircraft Reg</button>
      </div>
    );
  }
}

export default SortButtons;
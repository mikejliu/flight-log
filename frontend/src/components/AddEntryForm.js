import React, { Component } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
axios.defaults.withCredentials = true;

class AddEntryForm extends Component {
  state = {
    input_date: new Date(),
    input_airline: null,
    input_flight_number: null,
    input_from: null,
    input_to: null,
    input_aircraft: null,
    input_reg: null,
    add_warning: ""
  };

  addEntryToDb = () => {

    axios.post("http://localhost:3001/api/addEntry", {

      date: this.state.input_date.toDateString(),
      airline: this.state.input_airline,
      flight_number: this.state.input_flight_number,
      from: this.state.input_from,
      to: this.state.input_to,
      aircraft: this.state.input_aircraft,
      reg: this.state.input_reg

    }).then(function (response) {
      if (!response.data.success) {
        this.setState({ add_warning: response.data.error });
      } else {
        this.props.getEntryFromDb();
        this.setState({ add_warning: "" });
      }
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  };

  changeDate = date => {
    this.setState({
      input_date: date
    });
  }

  handleInputChange = e => {
    var target = e.target;
    var value = target.value;
    var name = target.name;
    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <div style={{ padding: "10px" }}>
        <div className="title">Add Entry</div>
        <DatePicker
          selected={this.state.input_date}
          onChange={this.changeDate}
        />
        <input
          name="input_airline"
          type="text"
          onChange={this.handleInputChange}
          placeholder="Airline"
          style={{ width: "200px" }}
        />
        <input
          name="input_flight_number"
          type="text"
          onChange={this.handleInputChange}
          placeholder="Flight Number"
          style={{ width: "200px" }}
        />
        <input
          name="input_from"
          type="text"
          onChange={this.handleInputChange}
          placeholder="From"
          style={{ width: "200px" }}
        />
        <input
          name="input_to"
          type="text"
          onChange={this.handleInputChange}
          placeholder="To"
          style={{ width: "200px" }}
        />
        <input
          name="input_aircraft"
          type="text"
          onChange={this.handleInputChange}
          placeholder="Aircraft Type"
          style={{ width: "200px" }}
        />
        <input
          name="input_reg"
          type="text"
          onChange={this.handleInputChange}
          placeholder="Aircraft Reg"
          style={{ width: "200px" }}
        />
        <button onClick={() => this.addEntryToDb()}>
          Add
          </button>
        <span>
          {this.state.add_warning}
        </span>
      </div>
    );
  }
}

export default AddEntryForm;
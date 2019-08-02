import React, { Component } from "react";
import axios from "axios";
import Alert from 'react-bootstrap/Alert';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormDownshift from "./FormDownshift";
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
    add_warning: "",
    show_fail: false,
    show_success: false
  };

  hideFail = () => {
    this.setState({ show_fail: false });
  }

  hideSuccess = () => {
    this.setState({ show_success: false });
  }

  addEntryToDb = () => {
    this.setState({ show_success: false });
    this.setState({ show_fail: false });
    axios.post("/api/addEntry", {
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
        this.setState({ show_fail: true });
      } else {
        this.setState({ show_success: true });
        this.setState({ add_warning: "" });
        this.props.getEntryFromDb();
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

  handleDownshiftChange = (name, value) => {
    this.setState({
      [name]: value
    });
  }

  render() {
    var { add_warning, show_fail, show_success } = this.state;
    return (
      <div className="flight-log-section">
        <h1>Add Entry</h1>
        <div className="form-row">
          <div className="form-group col-md-4">
            <div><label for="input_date">Date</label></div>
            <DatePicker
              id="input_date"
              name="input_date"
              className="form-control"
              selected={this.state.input_date}
              onChange={this.changeDate}
            />
          </div>
          <div className="form-group col-md-4">
            <label for="input_from">From</label>
            <FormDownshift handleDownshiftChange={this.handleDownshiftChange} name="input_from" />
          </div>
          <div className="form-group col-md-4">
            <label for="input_to">To</label>
            <FormDownshift handleDownshiftChange={this.handleDownshiftChange} name="input_to" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label for="input_airline">Airline</label>
            <FormDownshift handleDownshiftChange={this.handleDownshiftChange} name="input_airline" />
          </div>
          <div className="form-group col-md-6">
            <label for="input_flight_number">Flight Number</label>
            <input
              id="input_flight_number"
              name="input_flight_number"
              className="form-control"
              type="text"
              onChange={this.handleInputChange}
              placeholder="Flight Number"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label for="input_aircraft">Aircraft Type</label>
            <FormDownshift handleDownshiftChange={this.handleDownshiftChange} name="input_aircraft" />
          </div>
          <div className="form-group col-md-6">
            <label for="input_reg">Aircraft Reg</label>
            <input
              id="input_reg"
              name="input_reg"
              className="form-control"
              type="text"
              onChange={this.handleInputChange}
              placeholder="Aircraft Reg"
            />
          </div>
        </div>
        <button className="btn btn-primary btn-block" onClick={() => this.addEntryToDb()}>
          Add
        </button>
        {show_success && <Alert className="mt-2" variant="success" onClose={this.hideSuccess} dismissible>Entry added successfully</Alert>}
        {show_fail && <Alert className="mt-2" variant="danger" onClose={this.hideFail} dismissible>{add_warning}</Alert>}
      </div>
    );
  }
}

export default AddEntryForm;

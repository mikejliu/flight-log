import React, { Component } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

class Entry extends Component {

  deleteEntryFromDb = e => {
    var idToDelete = e.target.parentNode.id;
    axios.delete("http://localhost:3001/api/deleteEntry", {
      data: {
        id: idToDelete
      }
    }).then(function (response) {
      if (response.data.success) {
        this.props.getEntryFromDb();
      }
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  };

  render() {
    var dat = this.props.dat;
    return (
      <li key={dat._id} id={dat._id}>
        <span style={{ color: "gray" }}> Date: </span> {dat.date} <br />
        <span style={{ color: "gray" }}> Airline: </span> {dat.airline} <br />
        <span style={{ color: "gray" }}> Flight Number: </span> {dat.flight_number} <br />
        <span style={{ color: "gray" }}> From: </span> {dat.from} <br />
        <span style={{ color: "gray" }}> To: </span> {dat.to} <br />
        <span style={{ color: "gray" }}> Aircraft Type: </span> {dat.aircraft} <br />
        <span style={{ color: "gray" }}> Aircraft Reg: </span> {dat.reg} <br />
        {this.props.canDelete && <button onClick={this.deleteEntryFromDb}>Delete</button>}
      </li>
    );
  }
}

export default Entry;
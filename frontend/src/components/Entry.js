import React, { Component } from "react";
import axios from "axios";
import UploadImageForm from "./UploadImageForm";
import Image from "./Image";
axios.defaults.withCredentials = true;

class Entry extends Component {
  state = {
    images: [],
    view_images: false
  };

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

  hideImage = () => {
    this.setState({ view_images: false });
  }

  showImage = () => {
    this.setState({ view_images: true });
    this.getImageFromDb();
  }

  getImageFromDb = () => {
    axios.get("http://localhost:3001/api/getImage", {
      params: { flight_id: this.props.dat._id }
    }).then(function (response) {
      this.setState({ images: response.data.data });
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  };

  render() {
    var dat = this.props.dat;
    var { images, view_images } = this.state;
    return (
      <li key={dat._id} id={dat._id}>
        <span style={{ color: "gray" }}> Date: </span> {dat.date} <br />
        <span style={{ color: "gray" }}> Airline: </span> {dat.airline} <br />
        <span style={{ color: "gray" }}> Flight Number: </span> {dat.flight_number} <br />
        <span style={{ color: "gray" }}> From: </span> {dat.from} <br />
        <span style={{ color: "gray" }}> To: </span> {dat.to} <br />
        <span style={{ color: "gray" }}> Aircraft Type: </span> {dat.aircraft} <br />
        <span style={{ color: "gray" }}> Aircraft Reg: </span> {dat.reg} <br />
        {this.props.own && <button onClick={this.deleteEntryFromDb}>Delete</button>}
        {this.props.own && <UploadImageForm flight_id={dat._id} getImageFromDb={this.getImageFromDb} />}
        {view_images ? (<button onClick={this.hideImage}>Hide Image</button>) : (<button onClick={this.showImage}>Show Image</button>)}
        {view_images && <div style={{ padding: "10px" }}>
          {images.length <= 0
            ? "No image"
            : images.map(img => (
              <Image img={img} getImageFromDb={this.getImageFromDb} own={this.props.own} />
            ))}
        </div>}
      </li>
    );
  }
}

export default Entry;
import React, { Component } from "react";
import axios from "axios";
import UploadImageForm from "./UploadImageForm";
import Image from "./Image";
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
axios.defaults.withCredentials = true;

class Entry extends Component {
  state = {
    images: [],
    view_images: false
  };

  deleteEntryFromDb = e => {
    var idToDelete = e.target.parentNode.parentNode.id;
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
      <>
        <tr key={dat._id} id={dat._id}>
          <td>{dat.date}</td>
          <td>{dat.airline}</td>
          <td>{dat.flight_number}</td>
          <td>{dat.from}</td>
          <td>{dat.to}</td>
          <td>{dat.aircraft}</td>
          <td>{dat.reg}</td>
          {this.props.own && <td><Button variant="danger" onClick={this.deleteEntryFromDb}>Delete</Button></td>}
          {this.props.own && <td><UploadImageForm flight_id={dat._id} getImageFromDb={this.getImageFromDb} /></td>}
          <td><Button variant="primary" onClick={this.showImage}>Show Image</Button></td>
        </tr>
        <Modal show={view_images} onHide={this.hideImage}>
          <Modal.Header closeButton>
            <Modal.Title>{dat.flight_number} Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {images.length <= 0
              ? "No image"
              : images.map(img => (
                <Image img={img} getImageFromDb={this.getImageFromDb} own={this.props.own} />
              ))}
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default Entry;
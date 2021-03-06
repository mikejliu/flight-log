import React, { Component } from "react";
import Image from "./Image";
import UploadImageForm from "./UploadImageForm";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import axios from "axios";
axios.defaults.withCredentials = true;

class Entry extends Component {
  state = {
    images: [],
    view_image: false,
    upload_image: false,
    loading_image: false,
    deleting: false
  };

  deleteEntryFromDb = e => {
    this.setState({ deleting: true });
    var idToDelete = e.target.parentNode.parentNode.id;
    axios.delete("/api/deleteEntry", {
      data: {
        id: idToDelete
      }
    }).then(function (response) {
      if (response.data.success) {
        this.setState({ deleting: false });
        this.props.getEntryFromDb();
      }
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  };

  hideImage = () => {
    this.setState({ view_image: false });
  }

  showImage = () => {
    this.setState({ view_image: true });
    this.getImageFromDb();
  }

  getImageFromDb = () => {
    this.setState({ loading_image: true });
    axios.get("/api/getImage", {
      params: { flight_id: this.props.dat._id }
    }).then(function (response) {
      this.setState({ loading_image: false });
      this.setState({ images: response.data.data });
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  };

  hideUploader = () => {
    this.setState({ upload_image: false });
  }

  showUploader = () => {
    this.setState({ upload_image: true });
  }

  uploadFromView = () => {
    this.setState({ view_image: false });
    this.setState({ upload_image: true });
  }

  viewFromUpload = () => {
    this.setState({ upload_image: false });
    this.setState({ view_image: true });
    this.getImageFromDb();
  }

  render() {
    var { dat, own } = this.props;
    var { images, view_image, upload_image, loading_image, deleting } = this.state;
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
          {own && <td><button className="btn btn-primary btn-sm" onClick={this.showUploader}>Upload</button></td>}
          <td><button className="btn btn-primary btn-sm" onClick={this.showImage}>View</button></td>
          {own && <td><Button variant="danger" size="sm" disabled={deleting} onClick={this.deleteEntryFromDb}>{deleting ? 'Deleting...' : 'Delete'}</Button></td>}
        </tr>
        <Modal show={view_image} onHide={this.hideImage}>
          <Modal.Header closeButton>
            <Modal.Title>{dat.flight_number} Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loading_image ? "Loading..." : images.length <= 0
              ? "No image"
              : images.map(img => (
                <Image img={img} getImageFromDb={this.getImageFromDb} own={own} />
              ))
            }
            {own && <Button className="d-block mx-auto mt-2" variant="primary" onClick={this.uploadFromView}>Upload Image</Button>}
          </Modal.Body>
        </Modal>
        <Modal show={upload_image} onHide={this.hideUploader}>
          <Modal.Header closeButton>
            <Modal.Title>Upload Image for {dat.flight_number}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <UploadImageForm flight_id={dat._id} />
            <Button className="d-block mx-auto mt-2" variant="primary" onClick={this.viewFromUpload}>View Image</Button>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default Entry;

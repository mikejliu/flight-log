import React, { Component } from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button'
axios.defaults.withCredentials = true;

class Image extends Component {

  deleteImageFromDb = e => {
    var idToDelete = e.target.parentNode.id;
    axios.delete("http://localhost:3001/api/deleteImage", {
      data: {
        id: idToDelete
      }
    }).then(function (response) {
      if (response.data.success) {
        this.props.getImageFromDb();
      }
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  };

  // https://medium.com/@colinrlly/send-store-and-show-images-with-react-express-and-mongodb-592bc38a9ed
  arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  };

  render() {
    var img = this.props.img;
    return (
      <div key={img._id} id={img._id} className="my-3">
        <img
          src={'data:' + img.img.contentType + ';base64,' + this.arrayBufferToBase64(img.img.data.data)}
          alt='alt text'
          className="d-block w-100" />
        {this.props.own && 
          <Button variant="danger" size="sm" className="d-block mx-auto" onClick={this.deleteImageFromDb}>Delete</Button>
        }
      </div>
    );
  }
}

export default Image;
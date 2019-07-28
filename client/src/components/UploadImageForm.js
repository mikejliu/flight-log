import React, { Component } from "react";
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import axios from "axios";
axios.defaults.withCredentials = true;

class UploadImageForm extends Component {
  state = {
    selectedImg: null,
    uploading: false,
    show_success: false
  };

  hideSuccess = () => {
    this.setState({ show_success: false });
  }

  // https://blog.stvmlbrn.com/2017/12/17/upload-files-using-react-to-node-express-server.html
  uploadImageToDb = e => {
    e.preventDefault();
    this.setState({ uploading: true });
    var formData = new FormData();

    formData.append("avatar", this.state.selectedImg);
    formData.append("flight_id", this.props.flight_id);
    axios.post("/api/uploadImage", formData).then(function (response) {
      if (response.data.success) {
        this.setState({ show_success: true });
        this.setState({ uploading: false });
      }
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  }

  changeSelectedImage = e => {
    this.setState({ selectedImg: e.target.files[0] });
  }

  render() {
    var { uploading, show_success } = this.state;
    return (
      <>
        <form className="mb-2" onSubmit={this.uploadImageToDb} enctype="multipart/form-data" >
          <input type="file" name="avatar" id="imageToUpload" onChange={this.changeSelectedImage} />
          <Button type="submit" variant="primary" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</Button>
        </form>
        {show_success && <Alert variant="success" onClose={this.hideSuccess} dismissible>Image uploaded successfully</Alert>}
      </>
    );
  }
}

export default UploadImageForm;

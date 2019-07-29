import React, { Component } from "react";
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import axios from "axios";
axios.defaults.withCredentials = true;

class UploadImageForm extends Component {
  state = {
    selectedImg: null,
    uploading: false,
    upload_warning: "",
    show_fail: false,
    show_success: false
  };

  hideFail = () => {
    this.setState({ show_fail: false });
  }

  hideSuccess = () => {
    this.setState({ show_success: false });
  }

  // https://blog.stvmlbrn.com/2017/12/17/upload-files-using-react-to-node-express-server.html
  uploadImageToDb = e => {
    e.preventDefault();
    this.setState({ show_success: false });
    this.setState({ show_fail: false });
    this.setState({ uploading: true });
    var formData = new FormData();
    formData.append("avatar", this.state.selectedImg);
    formData.append("flight_id", this.props.flight_id);
    axios.post("/api/uploadImage", formData).then(function (response) {
      this.setState({ uploading: false });
      if (response.data.success) {
        this.setState({ show_success: true });
        this.setState({ upload_warning: "" });
      } else {
        this.setState({ upload_warning: response.data.error });
        this.setState({ show_fail: true });
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
    var { uploading, upload_warning, show_fail, show_success } = this.state;
    return (
      <>
        <form onSubmit={this.uploadImageToDb} enctype="multipart/form-data" >
          <input type="file" name="avatar" id="imageToUpload" onChange={this.changeSelectedImage} />
          <Button type="submit" variant="primary" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</Button>
        </form>
        {show_success && <Alert className="mt-2" variant="success" onClose={this.hideSuccess} dismissible>Image uploaded successfully</Alert>}
        {show_fail && <Alert className="mt-2" variant="danger" onClose={this.hideFail} dismissible>{upload_warning}</Alert>}
      </>
    );
  }
}

export default UploadImageForm;

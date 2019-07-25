import React, { Component } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

class UploadImageForm extends Component {
  state = {
    selectedImg: null
  };

  // https://blog.stvmlbrn.com/2017/12/17/upload-files-using-react-to-node-express-server.html
  uploadImageToDb = e => {
    e.preventDefault();
    var formData = new FormData();

    formData.append("avatar", this.state.selectedImg);
    formData.append("flight_id", this.props.flight_id);
    axios.post("http://localhost:3001/api/uploadImage", formData).then(function (response) {
      if (response.data.success) {
        this.props.getImageFromDb();
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
    return (
      <form onSubmit={this.uploadImageToDb} enctype="multipart/form-data" >
        <input type="file" name="avatar" id="imageToUpload" onChange={this.changeSelectedImage} />
        <input type="submit" value="Upload" />
      </form>
    );
  }
}

export default UploadImageForm;
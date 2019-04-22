import React, { Component } from "react";
import axios from "axios";
import { runInThisContext } from "vm";
axios.defaults.withCredentials = true;

class App extends Component {
  // initialize our state 
  
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
    user_username: null,
    user_password: null,
    logged_in: false,
    login_warning: "",
    create_user_warning: "",
    img: "",
    selectedImg: ""
  };
  

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has 
  // changed and implement those changes into our UI
  componentDidMount() {
    //this.getDataFromDb();
    // if (!this.state.intervalIsSet) {
    //   let interval = setInterval(this.getDataFromDb, 1000);
    //   this.setState({ intervalIsSet: interval });
    // }
  }

  // never let a process live forever 
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if(this.state.logged_in){
      this.logout();
    }
    // if (this.state.intervalIsSet) {
    //   clearInterval(this.state.intervalIsSet);
    //   this.setState({ intervalIsSet: null });
    // }
  }

  // just a note, here, in the front end, we use the id key of our data object 
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify 
  // data base entries

  // our first get method that uses our backend api to 
  // fetch data from our data base
  getDataFromDb = () => {
    // axios.get("http://localhost:3001/api/getData")
    //   .then(data => data.json())
    //   .then(res => this.setState({ data: res.data }));
    axios.get("http://localhost:3001/api/getData").then(function (response) {
      console.log(response.data.data);
      this.setState({ data: response.data.data })
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    });
    axios.get("http://localhost:3001/api/getImage").then(function (response) {
      console.log(response.data.data[0]);
      let base64Flag = 'data:image/png;base64,';
      let imageStr = this.arrayBufferToBase64(response.data.data[0].img.data.data);
      this.setState({ img: base64Flag + imageStr })
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
  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("http://localhost:3001/api/putData", {
      id: idToBeAdded,
      message: message
    }).then(function (response) {
      console.log(response.data);
      if(response.data.success){
        this.getDataFromDb();
      }
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    });
  };

  uploadImage = e =>{
    e.preventDefault();
    console.log("inside uploadImage");
    var formData = new FormData();
  
    formData.append("avatar", this.state.selectedImg);
    axios.post("http://localhost:3001/api/photo", formData);
  }
  
  changeSelectedImage = e => {
    this.setState({selectedImg: e.target.files[0]});
  }

  // our delete method that uses our backend api 
  // to remove existing database information
  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id === idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete("http://localhost:3001/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };


  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post("http://localhost:3001/api/updateData", {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
  };

  createUser = (username, password) => {
    

    axios.post("http://localhost:3001/api/createUser", {
      username: username,
      password: password
    }).then(function (response) {
      console.log(response.data);
      if(!response.data.success){
        console.log(response.data.error);
      }else{
        this.setState({create_user_warning:"User created successfully. Please login"});
      }
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    });
  };

  login = (username, password) => {
    

    axios.post("http://localhost:3001/api/login", {
      username: username,
      password: password
    }).then(function (response) {
      console.log(response.data);
      if(!response.data.success){
        this.setState({login_warning:response.data.error});
      }else{
        this.getDataFromDb();
        this.setState({login_warning:""});
        this.setState({create_user_warning:""});
        this.setState({user_username:null});
        this.setState({user_password:null});
        this.setState({logged_in:true});
      }
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    });
  
  };

  logout = () => {
    

    axios.get("http://localhost:3001/api/logout").then(function (response) {
      console.log(response.data);
      if(!response.data.success){
        console.log(response.data.error);
      }else{
        this.setState({logged_in:false});
        this.setState({data:[]});
      }
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    });
  
  };

  // here is our UI
  // it is easy to understand their functions when you 
  // see them render into our screen
  render() {
    const { data, logged_in } = this.state;
    if(logged_in){
      return(
        <div>
          <ul>
          {data.length <= 0
            ? "NO DB ENTRIES YET"
            : data.map(dat => (
                <li style={{ padding: "10px" }} key={data.message}>
                  <span style={{ color: "gray" }}> id: </span> {dat.id} <br />
                  <span style={{ color: "gray" }}> data: </span>
                  {dat.message}
                </li>
              ))}
        </ul>
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            onChange={e => this.setState({ message: e.target.value })}
            placeholder="add something in the database"
            style={{ width: "200px" }}
          />
          <button onClick={() => this.putDataToDB(this.state.message)}>
            ADD
          </button>
        </div>
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ idToDelete: e.target.value })}
            placeholder="put id of item to delete here"
          />
          <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
            DELETE
          </button>
        </div>
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ idToUpdate: e.target.value })}
            placeholder="id of item to update here"
          />
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ updateToApply: e.target.value })}
            placeholder="put new value of the item here"
          />
          <button
            onClick={() =>
              this.updateDB(this.state.idToUpdate, this.state.updateToApply)
            }
          >
            UPDATE
          </button>
        </div>
        <div>
        <form onSubmit={e => this.uploadImage(e)}>
        <input type="file" name="avatar" id="imageToUpload" onChange={e => this.changeSelectedImage(e)}/>
        <input type="submit" value="upload"/>
        </form>
        </div>

        <img
            src={this.state.img}
            alt='Helpful alt text'/>
        <div>
        <button
              onClick={() =>
                this.logout()
              }
            >
              Logout
            </button>
        </div>
        </div>

      );
    }else{
      return (
        <div>
          
          
  
          
          <div style={{ padding: "10px" }}>
            <input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ user_username: e.target.value })}
              placeholder="username"
            />
            <input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ user_password: e.target.value })}
              placeholder="password"
            />
            <button
              onClick={() =>
                this.createUser(this.state.user_username, this.state.user_password)
              }
            >
              Create user
            </button>
            <span>
              {this.state.create_user_warning}
            </span>
          </div>
  
          <div style={{ padding: "10px" }}>
            <input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ user_username: e.target.value })}
              placeholder="username"
            />
            <input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ user_password: e.target.value })}
              placeholder="password"
            />
            <button
              onClick={() =>
                this.login(this.state.user_username, this.state.user_password)
              }
            >
              Login
            </button>
            <span>
              {this.state.login_warning}
            </span>
          </div>
  
  
        </div>
      );
    }
    
  }
}

export default App;
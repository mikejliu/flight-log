import React, { Component } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
axios.defaults.withCredentials = true;

class App extends Component {
  // initialize our state 
  
  state = {
    data: [],
    images: [],
    input_date: new Date(),
    input_airline: null,
    input_flight_number: null,
    input_from: null,
    input_to: null,
    input_aircraft: null,
    input_reg: null,
    selectedImg: null,
    user_username: null,
    user_password: null,
    logged_in: false,
    login_warning: "",
    create_user_warning: "",
    add_warning: ""
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
      //console.log(response.data.data[0]);
      this.setState({ data: response.data.data })
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    });
    axios.get("http://localhost:3001/api/getImage").then(function (response) {
      console.log(response.data.data);
      this.setState({ images: response.data.data });
      // let base64Flag = 'data:image/png;base64,';
      // let imageStr = this.arrayBufferToBase64(response.data.data[0].img.data.data);
      // this.setState({ img: base64Flag + imageStr })
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
  putDataToDB = () => {
    console.log(this.state.input_date);

    axios.post("http://localhost:3001/api/putData", {
      
      date: this.state.input_date.toDateString(),
      airline: this.state.input_airline,
      flight_number: this.state.input_flight_number,
      from: this.state.input_from,
      to: this.state.input_to,
      aircraft: this.state.input_aircraft,
      reg: this.state.input_reg

    }).then(function (response) {
      console.log(response.data);
      if(!response.data.success){
        this.setState({add_warning:response.data.error});
      }else{
        this.getDataFromDb();
        this.setState({add_warning:""});
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
    axios.post("http://localhost:3001/api/photo", formData).then(function (response) {
      console.log(response.data);
      if(response.data.success){
        this.getDataFromDb();
      }
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    });
  }
  
  changeSelectedImage = e => {
    this.setState({selectedImg: e.target.files[0]});
  }

  // our delete method that uses our backend api 
  // to remove existing database information
  deleteFromDB = e => {
    let idToDelete = e.target.parentNode.id;
    console.log(idToDelete);

    axios.delete("http://localhost:3001/api/deleteData", {
      data: {
        id: idToDelete
      }
    }).then(function (response) {
      if(response.data.success){
        this.getDataFromDb();
      }
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    });
  };


  // our update method that uses our backend api
  // to overwrite existing data base information
  // updateDB = (idToUpdate, updateToApply) => {
  //   let objIdToUpdate = null;
  //   this.state.data.forEach(dat => {
  //     if (dat.id === idToUpdate) {
  //       objIdToUpdate = dat._id;
  //     }
  //   });

  //   axios.post("http://localhost:3001/api/updateData", {
  //     id: objIdToUpdate,
  //     update: { message: updateToApply }
  //   });
  // };

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

  changeDate = date => {
    this.setState({
      input_date: date
    });
  }

  // here is our UI
  // it is easy to understand their functions when you 
  // see them render into our screen
  render() {
    const { data, images, logged_in } = this.state;
    if(logged_in){
      return(
        <div>
          <div style={{ padding: "10px" }}>
          <DatePicker
            selected={this.state.input_date}
            onChange={this.changeDate}
          />
          <input
            type="text"
            onChange={e => this.setState({ input_airline: e.target.value })}
            placeholder="Airline"
            style={{ width: "200px" }}
          />
          <input
            type="text"
            onChange={e => this.setState({ input_flight_number: e.target.value })}
            placeholder="Flight Number"
            style={{ width: "200px" }}
          />
          <input
            type="text"
            onChange={e => this.setState({ input_from: e.target.value })}
            placeholder="From"
            style={{ width: "200px" }}
          />
          <input
            type="text"
            onChange={e => this.setState({ input_to: e.target.value })}
            placeholder="To"
            style={{ width: "200px" }}
          />
          <input
            type="text"
            onChange={e => this.setState({ input_aircraft: e.target.value })}
            placeholder="Aircraft Type"
            style={{ width: "200px" }}
          />
          <input
            type="text"
            onChange={e => this.setState({ input_reg: e.target.value })}
            placeholder="Aircraft Reg"
            style={{ width: "200px" }}
          />
          <button onClick={() => this.putDataToDB()}>
            ADD
          </button>
          <span>
              {this.state.add_warning}
            </span>
        </div>

          <ul>
          {data.length <= 0
            ? "NO DB ENTRIES YET"
            : data.map(dat => (
                <li style={{ padding: "10px" }} key={dat._id} id={dat._id}>
                  <span style={{ color: "gray" }}> Date: </span> {dat.date} <br />
                  <span style={{ color: "gray" }}> Airline: </span> {dat.airline} <br />
                  <span style={{ color: "gray" }}> Flight Number: </span> {dat.flight_number} <br />
                  <span style={{ color: "gray" }}> From: </span> {dat.from} <br />
                  <span style={{ color: "gray" }}> To: </span> {dat.to} <br />
                  <span style={{ color: "gray" }}> Aircraft Type: </span> {dat.aircraft} <br />
                  <span style={{ color: "gray" }}> Aircraft Reg: </span> {dat.reg} <br />
                  <button onClick={e => this.deleteFromDB(e)}>Delete</button>
                </li>
              ))}
        </ul>

        <div>
        <form onSubmit={e => this.uploadImage(e)}>
        <input type="file" name="avatar" id="imageToUpload" onChange={e => this.changeSelectedImage(e)}/>
        <input type="submit" value="upload"/>
        </form>
        </div>
        <div>
        {images.length <= 0
            ? "NO IMAGES YET"
            : images.map(img => (
                <img
                src={'data:'+img.img.contentType+';base64,'+this.arrayBufferToBase64(img.img.data.data)}
                alt='Helpful alt text'/>
              ))}
        </div>
        
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
import React, { Component } from "react";
import axios from "axios";
import AddEntryForm from './components/AddEntryForm';
import SortButton from './components/SortButton';
import Entry from './components/Entry';
import Public from './components/Public';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import plane1 from './images/plane1.jpg';
import plane2 from './images/plane2.jpg';
import plane3 from './images/plane3.jpg';
import plane4 from './images/plane4.jpg';
import plane5 from './images/plane5.jpg';
import CurrentAirport from "./components/CurrentAirport";
axios.defaults.withCredentials = true;

var planes = [plane1, plane2, plane3, plane4, plane5];
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
var planesIndex = getRandomInt(0, planes.length);

class App extends Component {
  state = {
    data: [],
    current_airport: null,
    current_airport_users: [],
    user_username: null,
    user_password: null,
    logged_in: false,
    is_public: false,
    public_users: [],
    login_warning: "",
    create_user_warning: "",
    current_user: null,
    show_create_success: false,
    show_create_fail: false,
    show_login_fail: false,
    planes_index: planesIndex
  };

  componentDidMount() {
  }

  componentWillUnmount() {
    if (this.state.logged_in) {
      this.logout();
    }
  }

  getEntryFromDb = () => {
    axios.get("/api/getEntry").then(function (response) {
      this.setState({ data: response.data.data })
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  }

  getDataFromDb = () => {
    axios.get("/api/getPublic").then(function (response) {
      this.setState({ is_public: response.data.data[0].public });
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
    axios.get("/api/getPublicUsers"
    ).then(function (response) {
      this.setState({ public_users: response.data.data })
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
    axios.get("/api/getCurrentAirport").then(function (response) {
      this.setState({ current_airport: response.data.data[0].airport });
      if (this.state.current_airport === null || this.state.current_airport === "") {
        this.setState({ current_airport_users: [] });
      } else {
        axios.get("/api/getAirportUsers", {
          params: { airport: this.state.current_airport }
        }).then(function (response) {
          this.setState({ current_airport_users: response.data.data })
        }.bind(this))
          .catch(function (error) {
            console.log(error);
          });
      }
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });

  };

  changePublic = () => {
    axios.post("/api/changePublic", {
      update: { public: !this.state.is_public }
    }).then(function (response) {
      if (response.data.success) {
        this.getDataFromDb();
      }
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  }

  createUser = (username, password) => {
    this.setState({ show_create_fail: false });
    this.setState({ show_create_success: false });
    axios.post("/api/createUser", {
      username: username,
      password: password
    }).then(function (response) {
      if (!response.data.success) {
        this.setState({ create_user_warning: response.data.error });
        this.setState({ show_create_fail: true });
      } else {
        this.setState({ show_create_success: true });
        this.setState({ create_user_warning: "" });
      }
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  };

  login = (username, password) => {
    this.setState({ show_login_fail: false });
    axios.post("/api/login", {
      username: username,
      password: password
    }).then(function (response) {
      if (!response.data.success) {
        this.setState({ login_warning: response.data.error });
        this.setState({ show_login_fail: true });
      } else {
        this.getEntryFromDb();
        this.getDataFromDb();
        this.setState({ current_user: response.data.user.username });
        this.setState({ login_warning: "" });
        this.setState({ create_user_warning: "" });
        this.setState({ user_username: null });
        this.setState({ user_password: null });
        this.setState({ show_create_success: false });
        this.setState({ show_create_fail: false });
        this.setState({ logged_in: true });
      }
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  };

  hideCreateSuccess = () => {
    this.setState({ show_create_success: false });
  }

  hideCreateFail = () => {
    this.setState({ show_create_fail: false });
  }

  hideLoginFail = () => {
    this.setState({ show_login_fail: false });
  }

  logout = () => {
    axios.get("/api/logout").then(function (response) {
      if (!response.data.success) {
        console.log(response.data.error);
      } else {
        this.setState({ logged_in: false });
        this.setState({ data: [] });
        this.setState({ current_airport_users: [] });
        this.setState({ public_users: [] });
        this.setState({ input_date: new Date() });
        this.setState({ current_user: null });
      }
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  };

  sort = e => {
    var name = e.target.name;
    var fieldName = name.substring(5);
    this.setState({ [name]: !this.state[name] });
    var sort = this.state[name];
    if (fieldName !== 'date') {
      this.setState({
        data: this.state.data.sort(function (a, b) {
          if (sort) return a[fieldName].localeCompare(b[fieldName]);
          return b[fieldName].localeCompare(a[fieldName]);
        })
      })
    } else {
      this.setState({
        data: this.state.data.sort(function (a, b) {
          var dateA = new Date(a.date);
          var dateB = new Date(b.date);
          if (dateA < dateB) {
            if (sort) return -1;
            return 1;
          }
          if (dateA > dateB) {
            if (sort) return 1;
            return -1;
          }
          return 0;
        })
      })
    }
  }

  render() {
    var { 
      data, 
      current_airport, 
      current_airport_users, 
      logged_in, 
      is_public, 
      public_users, 
      current_user, 
      login_warning, 
      create_user_warning, 
      show_create_success, 
      show_create_fail, 
      show_login_fail, 
      planes_index,
      user_username,
      user_password
    } = this.state;
    if (logged_in) {
      return (
        <div>
          <div className="flight-log-section">
            <h1>Welcome to your flight log, {current_user}</h1>
            <button className="btn btn-secondary btn-sm" onClick={this.logout}>Logout</button>
          </div>

          <AddEntryForm getEntryFromDb={this.getEntryFromDb} />

          <div className="flight-log-section">
            <h1>Your Flight Log <span role="img" aria-label="plane">✈️</span></h1>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th><SortButton sort={this.sort} text="Date" name="sort_date" /></th>
                  <th><SortButton sort={this.sort} text="Airline" name="sort_airline" /></th>
                  <th><SortButton sort={this.sort} text="Flight Number" name="sort_flight_number" /></th>
                  <th><SortButton sort={this.sort} text="From" name="sort_from" /></th>
                  <th><SortButton sort={this.sort} text="To" name="sort_to" /></th>
                  <th><SortButton sort={this.sort} text="Aircraft Type" name="sort_aircraft" /></th>
                  <th><SortButton sort={this.sort} text="Aircraft Reg" name="sort_reg" /></th>
                  <th>Upload Image</th>
                  <th>View Image</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {data.length <= 0
                  ? <tr><td colSpan="10">You do not have any entry</td></tr>
                  : data.map(dat => (
                    <Entry dat={dat} getEntryFromDb={this.getEntryFromDb} own={true} />
                  ))
                }
              </tbody>
            </Table>
          </div>

          <div className="flight-log-section">
            <h1>Your Flight Log is Currently
              {is_public ? <span className="text-success"> Public</span> : <span className="text-danger"> Private</span>}
            </h1>
            <button className="btn btn-primary btn-sm" onClick={this.changePublic}>Change to {is_public ? 'Private' : 'Public'}</button>
          </div>

          <Public public_users={public_users} />

          <CurrentAirport current_airport={current_airport} getDataFromDb={this.getDataFromDb} />

          {(current_airport !== null && current_airport !== '') &&
            <div className="flight-log-section">
              <h1>Current Users at {current_airport}</h1>
              <ul className="list-group">
                {current_airport_users.length <= 0
                  ? <li className="list-group-item disabled">No users</li>
                  : current_airport_users.map(user => (
                    <li className="list-group-item">{user.username}</li>
                  ))
                }
              </ul>
            </div>
          }
        </div>
      );
    } else {
      return (
        <div className="container">
          <div className="row">
            <div className="col flight-log-section mr-3">
              <img className="img-fluid" src={planes[planes_index]} alt="plane" />
              <p className="text-muted text-right"><small>Image &#169; 2019 Jiayuan Liu</small></p>
              <h1 className="display-3 text-right mt-2">My Flight Log</h1>
            </div>
            <div className="col">
              <div className="flight-log-section">
                <h1>Create User</h1>
                <div className="form-group">
                  <label for="create_user_username">Username</label>
                  <input
                    id="create_user_username"
                    name="create_user_username"
                    className="form-control"
                    type="text"
                    onChange={e => this.setState({ user_username: e.target.value })}
                    placeholder="Username"
                  />
                </div>
                <div className="form-group">
                  <label for="create_user_password">Password</label>
                  <input
                    id="create_user_password"
                    name="create_user_password"
                    className="form-control"
                    type="password"
                    onChange={e => this.setState({ user_password: e.target.value })}
                    placeholder="Password"
                    aria-describedby="create_user_password_help"
                  />
                  <small id="create_user_password_help" class="form-text text-muted">Your password will be hashed</small>
                </div>
                <button
                  className="btn btn-primary mb-2"
                  onClick={() => this.createUser(user_username, user_password)}
                >
                  Create User
                </button>
                {show_create_success && <Alert variant="success" onClose={this.hideCreateSuccess} dismissible>User created successfully. Please login.</Alert>}
                {show_create_fail && <Alert variant="danger" onClose={this.hideCreateFail} dismissible>{create_user_warning}</Alert>}
              </div>

              <div className="flight-log-section">
                <h1>Login</h1>
                <div className="form-group">
                  <label for="login_username">Username</label>
                  <input
                    id="login_username"
                    name="login_username"
                    className="form-control"
                    type="text"
                    onChange={e => this.setState({ user_username: e.target.value })}
                    placeholder="Username"
                  />
                </div>
                <div className="form-group">
                  <label for="login_password">Password</label>
                  <input
                    id="login_password"
                    name="login_password"
                    className="form-control"
                    type="password"
                    onChange={e => this.setState({ user_password: e.target.value })}
                    placeholder="Password"
                  />
                </div>
                <button
                  className="btn btn-primary mb-2"
                  onClick={() => this.login(user_username, user_password)}
                >
                  Login
                </button>
                {show_login_fail && <Alert variant="danger" onClose={this.hideLoginFail} dismissible>{login_warning}</Alert>}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default App;

import React, { Component } from "react";
import axios from "axios";
import AddEntryForm from './components/AddEntryForm';
import SortButtons from './components/SortButtons';
import Entry from './components/Entry';
import Public from './components/Public';
import Table from 'react-bootstrap/Table';
axios.defaults.withCredentials = true;

class App extends Component {
  state = {
    data: [],
    sort_date: false,
    sort_airline: false,
    sort_flight_number: false,
    sort_from: false,
    sort_to: false,
    sort_aircraft: false,
    sort_reg: false,
    current_airport: "",
    input_current_airport: null,
    current_airport_users: [],
    user_username: null,
    user_password: null,
    logged_in: false,
    is_public: false,
    public_users: [],
    login_warning: "",
    create_user_warning: ""
  };

  componentDidMount() {
  }

  componentWillUnmount() {
    if (this.state.logged_in) {
      this.logout();
    }
  }

  getEntryFromDb = () => {
    axios.get("http://localhost:3001/api/getEntry").then(function (response) {
      this.setState({ data: response.data.data })
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  }

  getDataFromDb = () => {
    axios.get("http://localhost:3001/api/getPublic").then(function (response) {
      this.setState({ is_public: response.data.data[0].public });
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
    axios.get("http://localhost:3001/api/getPublicUsers"
    ).then(function (response) {
      this.setState({ public_users: response.data.data })
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
    axios.get("http://localhost:3001/api/getCurrentAirport").then(function (response) {
      this.setState({ current_airport: response.data.data[0].airport });
      axios.get("http://localhost:3001/api/getAirportUsers", {
        params: { airport: this.state.current_airport }
      }).then(function (response) {
        if (this.state.current_airport === null || this.state.current_airport === "") {
          this.setState({ current_airport_users: [] })
        }
        else {
          this.setState({ current_airport_users: response.data.data })
        }
      }.bind(this))
        .catch(function (error) {
          console.log(error);
        });
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });

  };

  submitCurrentAirport = () => {
    axios.post("http://localhost:3001/api/submitCurrentAirport", {
      update: { airport: this.state.input_current_airport }
    }).then(function (response) {
      if (response.data.success) {
        this.getDataFromDb();
      }
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  }

  changePublic = () => {
    axios.post("http://localhost:3001/api/changePublic", {
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
    axios.post("http://localhost:3001/api/createUser", {
      username: username,
      password: password
    }).then(function (response) {
      if (!response.data.success) {
        console.log(response.data.error);
      } else {
        this.setState({ create_user_warning: "User created successfully. Please login" });
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
      if (!response.data.success) {
        this.setState({ login_warning: response.data.error });
      } else {
        this.getEntryFromDb();
        this.getDataFromDb();
        this.setState({ login_warning: "" });
        this.setState({ create_user_warning: "" });
        this.setState({ user_username: null });
        this.setState({ user_password: null });
        this.setState({ logged_in: true });
      }
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  };

  logout = () => {
    axios.get("http://localhost:3001/api/logout").then(function (response) {
      if (!response.data.success) {
        console.log(response.data.error);
      } else {
        this.setState({ logged_in: false });
        this.setState({ data: [] });
        this.setState({ current_airport_users: [] });
        this.setState({ public_users: [] });
        this.setState({ view_public: false });
        this.setState({ public_log: [] });
        this.setState({ input_date: new Date() });
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
    var { data, current_airport_users, logged_in, public_users } = this.state;
    if (logged_in) {
      return (
        <div>
          <AddEntryForm getEntryFromDb={this.getEntryFromDb} />
          <SortButtons sort={this.sort} />

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Airline</th>
                <th>Flight Number</th>
                <th>From</th>
                <th>To</th>
                <th>Aircraft Type</th>
                <th>Aircraft Reg</th>
                <th>Delete</th>
                <th>Upload Image</th>
                <th>Show Image</th>
              </tr>
            </thead>
            <tbody>
            {data.length <= 0
              ? <tr><td colSpan="10">You do not have any entry</td></tr>
              : data.map(dat => (
                <Entry dat={dat} getEntryFromDb={this.getEntryFromDb} own={true} />
              ))}
            </tbody>
          </Table>

          



          <div style={{ padding: "10px" }}>
            <div className="title">Your Current Airport <span>
              {this.state.current_airport}
            </span></div>

            <input
              type="text"
              onChange={e => this.setState({ input_current_airport: e.target.value })}
              placeholder="Update Current Airport"
              style={{ width: "200px" }}
            />
            <button onClick={() => this.submitCurrentAirport()}>
              Submit
          </button></div>
          <div style={{ padding: "10px" }}>
            {(current_airport_users.length > 0) ? (<div className="title">Current Users at {this.state.current_airport}</div>) : (<div>Please update your current airport to see list of users near you</div>)}
            <ul>
              {current_airport_users.length <= 0
                ? ""
                : current_airport_users.map(user => (
                  <li>
                    {user.username}
                  </li>
                ))}
            </ul>
          </div>


          <div style={{ padding: "10px" }}>
            <div className="title">Your Flight Log is Currently <span style={{ color: 'red' }}>
              {this.state.is_public ? 'PUBLIC' : 'PRIVATE'}
            </span></div>
            <button onClick={() => this.changePublic()}>
              Change
          </button>

          </div>
          <Public public_users={public_users} />

          <div style={{ padding: "10px" }}>
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
    } else {
      return (
        <div>
          <div style={{ padding: "10px" }}>
            <input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ user_username: e.target.value })}
              placeholder="Username"
            />
            <input
              type="password"
              style={{ width: "200px" }}
              onChange={e => this.setState({ user_password: e.target.value })}
              placeholder="Password"
            />
            <button
              onClick={() =>
                this.createUser(this.state.user_username, this.state.user_password)
              }
            >
              Create User
            </button>
            <div>
              {this.state.create_user_warning}
            </div>
          </div>

          <div style={{ padding: "10px" }}>
            <input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ user_username: e.target.value })}
              placeholder="Username"
            />
            <input
              type="password"
              style={{ width: "200px" }}
              onChange={e => this.setState({ user_password: e.target.value })}
              placeholder="Password"
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
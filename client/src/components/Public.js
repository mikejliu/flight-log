import React, { Component } from "react";
import axios from "axios";
import Entry from './Entry';
import SortButton from './SortButton';
import Table from 'react-bootstrap/Table';
axios.defaults.withCredentials = true;

class Public extends Component {
  state = {
    public_log: [],
    view_public: false,
    sort_date: false,
    sort_airline: false,
    sort_flight_number: false,
    sort_from: false,
    sort_to: false,
    sort_aircraft: false,
    sort_reg: false
  };

  viewPublic = e => {
    Array.from(e.target.parentNode.children).forEach(child => child.classList.remove('active'));
    e.target.classList.add('active');
    this.setState({ view_public: true });
    var publicUsername = e.target.id;
    axios.get("/api/getPublicLog", {
      params: { username: publicUsername }
    }).then(function (response) {
      this.setState({ public_log: response.data.data });
      this.setState({ sort_date: false });
      this.setState({ sort_airline: false });
      this.setState({ sort_flight_number: false });
      this.setState({ sort_from: false });
      this.setState({ sort_to: false });
      this.setState({ sort_aircraft: false });
      this.setState({ sort_reg: false });
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  }

  hidePublic = () => {
    Array.from(document.getElementById('public_users_list').children).forEach(child => child.classList.remove('active'));
    this.setState({ view_public: false });
    this.setState({ public_log: [] });
  }

  sort = e => {
    var name = e.target.name;
    var fieldName = name.substring(5);
    this.setState({ [name]: !this.state[name] });
    var sort = this.state[name];
    if (fieldName !== 'date') {
      this.setState({
        public_log: this.state.public_log.sort(function (a, b) {
          if (sort) return a[fieldName].localeCompare(b[fieldName]);
          return b[fieldName].localeCompare(a[fieldName]);
        })
      })
    } else {
      this.setState({
        public_log: this.state.public_log.sort(function (a, b) {
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
    var { view_public, public_log } = this.state;
    var { public_users } = this.props;
    return (
      <div className="flight-log-section">
        <h1>Public Users</h1>
        <div id="public_users_list" className="list-group">
          {public_users.length <= 0
            ? <button type="button" className="list-group-item list-group-item-action" disabled>
              No public users
            </button>
            : public_users.map(user => (
              <button type="button" className="list-group-item list-group-item-action" onClick={this.viewPublic} id={user.username}>
                {user.username}
              </button>
            ))
          }
        </div>
        {view_public
          ? (
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
                  <th>View Image</th>
                </tr>
              </thead>
              <tbody>
                {public_log.length <= 0
                  ? <tr><td colSpan="8">This user does not have any entry</td></tr>
                  : public_log.map(dat => (
                    <Entry dat={dat} own={false} />
                  ))
                }
              </tbody>
            </Table>
          ) : (<h5 className="mt-2">Select a user to view their flight log</h5>)
        }
        {view_public &&
          <button className="btn btn-primary btn-sm" onClick={this.hidePublic}>
            Hide
          </button>
        }
      </div>
    );
  }
}

export default Public;

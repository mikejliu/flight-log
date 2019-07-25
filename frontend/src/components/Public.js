import React, { Component } from "react";
import axios from "axios";
import Entry from './Entry';
import Table from 'react-bootstrap/Table';
axios.defaults.withCredentials = true;

class Public extends Component {
  state = {
    public_log: [],
    view_public: false
  };

  viewPublic = e => {
    this.setState({ view_public: true });
    var publicUsername = e.target.id;
    axios.get("http://localhost:3001/api/getPublicLog", {
      params: { username: publicUsername }
    }).then(function (response) {
      this.setState({ public_log: response.data.data })
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  }

  hidePublic = () => {
    this.setState({ view_public: false });
    this.setState({ public_log: [] });
  }

  render() {
    var { view_public, public_log } = this.state;
    var { public_users } = this.props;
    return (
      <div style={{ padding: "10px" }}>
        <div className="title">List of Public Users</div>
        <div className="list-group">
          {public_users.length <= 0
            ? <button type="button" className="list-group-item list-group-item-action" disabled>
            No public users
          </button>
            : public_users.map(user => (
              <button type="button" className="list-group-item list-group-item-action" onClick={this.viewPublic} id={user.username}>
                {user.username}
              </button>
            ))}
        </div>
        {view_public ? (<Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Airline</th>
                <th>Flight Number</th>
                <th>From</th>
                <th>To</th>
                <th>Aircraft Type</th>
                <th>Aircraft Reg</th>
                <th>Show Image</th>
              </tr>
            </thead>
            <tbody>
            {public_log.length <= 0
              ? <tr><td colSpan="8">This user does not have any entry</td></tr>
              : public_log.map(dat => (
                <Entry dat={dat} own={false} />
              ))}
            </tbody>
          </Table>) : (<div>Select a public user to view their flight log</div>)}
        {view_public && <button onClick={this.hidePublic}>
          Hide
          </button>}
      </div>
    );
  }
}

export default Public;
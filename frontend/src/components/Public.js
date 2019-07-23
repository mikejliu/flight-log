import React, { Component } from "react";
import axios from "axios";
import Entry from './Entry';
axios.defaults.withCredentials = true;

class Public extends Component {
  state = {
    public_log: [],
    view_public: false
  };

  viewPublic = e => {
    this.setState({ view_public: true });
    var publicUsername = e.target.parentNode.id;
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
    var public_users = this.props.public_users;
    return (
      <div style={{ padding: "10px" }}>
        <div className="title">List of Public Users</div>
        <ul>
          {public_users.length <= 0
            ? "No public users"
            : public_users.map(user => (
              <li id={user.username}>
                {user.username}
                <button onClick={this.viewPublic}>
                  View
          </button>
              </li>
            ))}
        </ul>
        {view_public ? (<ul>
          {public_log.length <= 0
            ? "This user does not have any entry"
            : public_log.map(dat => (
              <Entry dat={dat} own={false} />
            ))}
        </ul>) : (<div>Select a public user to view their flight log</div>)}
        {view_public && <button onClick={this.hidePublic}>
          Hide
          </button>}
      </div>
    );
  }
}

export default Public;
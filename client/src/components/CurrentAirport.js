import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import airports from '../data/airports.json'
import axios from "axios";
axios.defaults.withCredentials = true;

class CurrentAirport extends Component {

  state = {
    possible_current_airports: [],
    getting_current_location: false,
    got_current_location: false
  };

  submitCurrentAirport = e => {
    axios.post("/api/submitCurrentAirport", {
      update: { airport: e.target.id }
    }).then(function (response) {
      if (response.data.success) {
        this.props.getDataFromDb();
        this.setState({ got_current_location: false });
        this.setState({ possible_current_airports: [] });
      }
    }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  }

  leaveCurrentAirport = () => {
    axios.post("/api/leaveCurrentAirport")
      .then(function (response) {
        if (response.data.success) {
          this.props.getDataFromDb();
        }
      }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  }

  getCurrentLocation = () => {
    this.setState({ got_current_location: false });
    this.setState({ getting_current_location: true });
    this.setState({ possible_current_airports: [] });
    navigator.geolocation.getCurrentPosition(pos => {
      var crd = pos.coords;
      airports.forEach(airport => {
        if (airport.lat > crd.latitude - 0.3 && airport.lat < crd.latitude + 0.3 && airport.long > crd.longitude - 0.3 && airport.long < crd.longitude + 0.3) {
          this.setState({ possible_current_airports: [...this.state.possible_current_airports, airport] });
        }
      })
      this.setState({ getting_current_location: false });
      this.setState({ got_current_location: true });
    })
  }

  airportToString = i => (i ? i.iata !== "" ? i.name.toString().concat(' (', i.iata, ')') : i.name.toString() : '')

  airportToShortString = i => (i ? i.iata !== "" ? i.iata.toString() : i.name.toString() : '')

  render() {
    var { current_airport } = this.props;
    var { possible_current_airports, getting_current_location, got_current_location } = this.state;
    return (
      <div className="flight-log-section">
        <h1>Your Current Airport is {(current_airport !== null && current_airport !== '') ? <span>{current_airport}</span> : 'not set'}</h1>
        {(current_airport === null || current_airport === '')
          ?
          <>
            <div>
              <Button variant="primary" size="sm" onClick={this.getCurrentLocation} disabled={getting_current_location}>{getting_current_location ? 'Getting...' : 'Get list of airports near you'}</Button>
            </div>
            {got_current_location &&
              <div className="list-group mt-2">
                {possible_current_airports.length === 0
                  ?
                  <button type="button" className="list-group-item list-group-item-action" disabled>
                    Cannot find airports near you
                  </button>
                  :
                  <>
                    <button type="button" className="list-group-item list-group-item-action" disabled>
                      Select your current airport to see a list of users near you
                    </button>
                    {possible_current_airports.map(airport => (
                      <button type="button" className="list-group-item list-group-item-action" onClick={this.submitCurrentAirport} id={this.airportToShortString(airport)}>
                        {this.airportToString(airport)}
                      </button>
                    ))}
                  </>
                }
              </div>
            }
          </>
          :
          <button className="btn btn-primary btn-sm" onClick={this.leaveCurrentAirport}>
            Leave this airport
          </button>
        }
      </div>
    );
  }
}

export default CurrentAirport;

import React, { Component } from "react";

class PathMap extends Component {
  render() {
    var { data } = this.props;
    if (data.length <= 0) {
      return (<img alt='alt text' className="d-block mx-auto" src="https://maps.googleapis.com/maps/api/staticmap?center=0,0&zoom=1&size=640x640&key=AIzaSyAs7nWWtvnwA3eNYagBV6eOkX4-8Q1qc5g" />)
    }
    else {
      var url = "";
      data.forEach(dat => {
        if (dat.from_lat && dat.from_lat !== "" && 
            dat.from_long && dat.from_long !== "" &&
            dat.to_lat && dat.to_lat !== "" && 
            dat.to_long && dat.to_long !== "") {
              url = url.concat("path=color:0xff000080|weight:2|geodesic:true|",dat.from_lat,",",dat.from_long,"|",dat.to_lat,",",dat.to_long,"&");
            }
      })
      if (url !== "") {
        return (<img alt='alt text' className="d-block mx-auto" src={"https://maps.googleapis.com/maps/api/staticmap?"+url+"size=640x640&key=AIzaSyAs7nWWtvnwA3eNYagBV6eOkX4-8Q1qc5g"} />);
      }
      else {
        return (<img alt='alt text' className="d-block mx-auto" src="https://maps.googleapis.com/maps/api/staticmap?center=0,0&zoom=1&size=640x640&key=AIzaSyAs7nWWtvnwA3eNYagBV6eOkX4-8Q1qc5g" />)
      }
    }
  }
}

export default PathMap;

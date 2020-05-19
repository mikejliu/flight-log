import React, { Component } from "react";

class PathMap extends Component {
  render() {
    var { option, data } = this.props;
    var option_string = "";
    var paths_string = "";

    data.forEach(dat => {
      if (dat.from_lat && dat.from_lat !== "" && 
          dat.from_long && dat.from_long !== "" &&
          dat.to_lat && dat.to_lat !== "" && 
          dat.to_long && dat.to_long !== "") {
            paths_string = paths_string.concat("path=color:0xff000080|weight:2|geodesic:true|",dat.from_lat,",",dat.from_long,"|",dat.to_lat,",",dat.to_long,"&");
          }
    })

    if (option === "auto-path" && paths_string !== "") {
      option_string = "size=640x640&";
    } else if (option === "us-path") {
      option_string = "center=39.833333,-95&zoom=3&scale=2&size=400x300&";
    } else {
      option_string = "center=0,0&zoom=1&size=640x640&";
    }

    return (<img alt='path map' className="d-block mx-auto my-3" src={"https://maps.googleapis.com/maps/api/staticmap?"+option_string+paths_string+"&key=AIzaSyAs7nWWtvnwA3eNYagBV6eOkX4-8Q1qc5g"} />);
  }
}

export default PathMap;

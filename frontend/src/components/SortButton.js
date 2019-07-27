import React, { Component } from "react";

class SortButton extends Component {
  sort = e => {
    this.props.sort(e);
  }

  render() {
    return (
      <button type="button" className="btn btn-light" name={this.props.name} onClick={this.sort}>{this.props.text}</button>
    );
  }
}

export default SortButton;
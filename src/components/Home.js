import React from "react";
import BoardGameCollection from "./BoardGameCollection";

// Home page component
export default class Home extends React.Component {
  // render
  render() {
    return (
      <div className="page-home">
        <BoardGameCollection />
      </div>
    );
  }
}
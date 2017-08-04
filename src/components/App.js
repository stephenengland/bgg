import React from "react";
import { connect } from "react-redux";
import "../stylesheets/main.scss";
import { loadCollection } from "../reducers/collection"

// app component
export class App extends React.Component {
  componentDidMount () {
    this.props.load();
  }

  // render
  render() {
    return (
      <div className="container">
        { this.props.children }
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    load: () => {
      dispatch(loadCollection())
    }
  }
}
export default connect(null, mapDispatchToProps)(App);
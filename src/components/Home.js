import React from "react";
import { connect } from "react-redux";
import BoardGameCollection from "./BoardGameCollection";
import UsernameInput from "./UsernameInput";

// Home page component
export class Home extends React.Component {
  // render
  render() {
    const { user } = this.props;
    return (
      <div className="page-home">
        <UsernameInput selectedUser={user.selectedUser} />
        <BoardGameCollection />
      </div>
    );
  }
}

// export the connected class
function mapStateToProps(state) {
  return {
    user: state.user
  };
}
export default connect(mapStateToProps)(Home);
import React from "react";
import { connect } from "react-redux";
import BoardGameCollection from "./BoardGameCollection";
import UsernameInput from "./UsernameInput";
import UserList from "./UserList";
import { loadUser } from "../reducers/users";
import { loadCollection } from "../reducers/collection";

export class Home extends React.Component {

  convertUsersToArray(usersString) {
    if (usersString.indexOf(',') > -1) {
      return usersString.split(',');
    }

    return [usersString];
  }

  componentDidMount() {
    let { selectedUsers, dispatch } = this.props;

    if (selectedUsers) {
      selectedUsers = this.convertUsersToArray(selectedUsers);

      selectedUsers.forEach(function(item) {
        dispatch(loadUser(item));
      });

      dispatch(loadCollection());
    }
  }

  render() {
    const { users } = this.props;
    return (
      <div className="page-home">
        <UsernameInput />
        <UserList />
        <BoardGameCollection />
      </div>
    );
  }
}

// export the connected class
function mapStateToProps(state, ownProps) {
  return {
    users: state.users,
    selectedUsers: ownProps.routeParams && ownProps.routeParams.users
  };
}
export default connect(mapStateToProps)(Home);
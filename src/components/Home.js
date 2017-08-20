import React from "react";
import { connect } from "react-redux";
import BoardGameCollection from "./BoardGameCollection";
import UsernameInput from "./UsernameInput";
import UserList from "./UserList";
import { loadUser, getUserRoute } from "../reducers/users";
import { push  } from 'react-router-redux';

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
    }
  }

  synchronizeUserRoute(nextProps) {
    let { users, selectedUsers, dispatch } = nextProps;
    let old_users = this.props.users;

    const numberOfUsersHaveChanged = users && users.items.length !== old_users.items.length;
    if (numberOfUsersHaveChanged) {
      dispatch(push(getUserRoute(users)));
    }
  }

  componentWillReceiveProps(nextProps) {
    this.synchronizeUserRoute(nextProps);
  }

  render() {
    const { users } = this.props;
    return (
      <div className="page-home">
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="nav navbar-nav navbar-left">
              <UsernameInput />
            </div>
            <div className="nav navbar-nav navbar-right">
              <UserList />
            </div>
          </div>
        </nav>
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
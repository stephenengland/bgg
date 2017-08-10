import React from "react";
import { connect } from "react-redux";
import { unloadUser } from "../reducers/users";

export class UserList extends React.Component {

  removeUser(user, e) {
    e.preventDefault();
    this.props.dispatch(unloadUser(user));
  }
  
  render() {
    const { users, dispatch } = this.props;

    return (
        <div className="user-list">
          {users.map((user, index) => {
              return (
                <div className="user" key={index}>
                    <strong>{user}</strong>&nbsp;
                    <button className="btn btn-xs btn-danger" onClick={this.removeUser.bind(this, user)}>
                      <i className="glyphicon glyphicon-remove"></i>
                    </button>
                </div>
              );
          })}
        </div>
    );
  }
}

function mapStateToProps(state) {
    return { 
        users: state.users && state.users.items || [] 
    };
};

export default connect(mapStateToProps)(UserList);
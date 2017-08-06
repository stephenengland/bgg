import React from "react";
import { connect } from "react-redux";

export class UserList extends React.Component {
  render() {
    const { users } = this.props;

    return (
        <div>
          {users.map((user, index) => {
              return (
                <div key={index}>
                    {user}
                </div>
              );
          })}
        </div>
    );
  }
}

function mapStateToProps(state) {
    return { 
        users: state.users || [] 
    };
};

export default connect(mapStateToProps)(UserList);
import React from "react";
import { connect } from "react-redux";
import { loadUser } from "../reducers/users"

export class UsernameInput extends React.Component {
  handleTextChange(event) {
    this.selectedUser = event.target.value;
  }

  render() {
    const { users, dispatch } = this.props;

    return (
        <form className="navbar-form form-inline" onSubmit={e => {
                e.preventDefault();
                dispatch(loadUser(this.selectedUser));
            }}>
            <div className="form-group">
                <label htmlFor="selected-user">Username</label>
                <input id="selected-user" type="text" className="form-control"
                  onChange={event => this.handleTextChange(event)}
                  style={{"marginLeft": "10px", "marginRight": "10px"}} />
            </div>
            <button type="submit" className="btn btn-default">View Collection</button>
            <div className="form-group">
              { this.props.children }
            </div>
        </form>
    );
  }
}
export default connect(state => { return { users: state.users||[] } })(UsernameInput);
import React from "react";
import { connect } from "react-redux";
import { loadUser } from "../reducers/user"

export class UsernameInput extends React.Component {
  constructor(props) {
    super(props);
  }

  handleTextChange(event) {
    this.selectedUser = event.target.value;
  }

  render() {
    const { selectedUser, dispatch } = this.props;

    return (
        <form className="form-inline" onSubmit={e => {
                e.preventDefault();
                dispatch(loadUser(this.selectedUser))
            }}>
            <div className="form-group">
                <label htmlFor="selected-user">Username</label>
                <input id="selected-user" type="text" className="form-control"
                  value={selectedUser}
                  onChange={event => this.handleTextChange(event)}
                  style={{"marginLeft": "10px", "marginRight": "10px"}} />
            </div>
            <button type="submit" className="btn btn-default">View Collection</button>
        </form>
    );
  }
}
export default connect()(UsernameInput);
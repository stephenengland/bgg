import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { Table } from "react-bootstrap";

export class BoardGameCollection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const {collection} = this.props;

    return (
      <div>
        <Table bordered hover responsive striped>
          <thead>
          <tr>
            <th>Names</th>
          </tr>
          </thead>
          <tbody>
          {collection.map((boardgame, index) => {
              return (
                <tr key={index}>
                    <td>{boardgame.name}</td>
                </tr>
              );
          })}
          </tbody>
        </Table>
      </div>
    );
  }
}

// export the connected class
function mapStateToProps(state) {
  return {
    collection: state.collection
  };
}
export default connect(mapStateToProps)(BoardGameCollection);
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
          {collection.map((boardgame, index) => {
              return (
                <div className="col-md-2 col-sm-4 col-xs-6 text-center" key={index}>
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <h4>{boardgame.name}</h4>
                    </div>
                    <div className="panel-body">
                      <img src={boardgame.thumbnail} className="img-rounded img-responsive center-block" />
                    </div>
                    <div className="panel-footer">
                        <div className="row">
                          <div className="col-md-6">
                            Rating: {boardgame.rating}
                          </div>
                          <div className="col-md-6">
                            <div className="hidden-md hidden-lg">
                              {boardgame.label}
                            </div>
                            <div className="pull-right hidden-sm hidden-xs">
                              {boardgame.label}
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              );
          })}
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
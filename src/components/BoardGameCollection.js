import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import BoardGame from "./BoardGame";
//import Masonry from 'masonry-layout'

export class BoardGameCollection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  /*
  componentDidMount() {
    const grid = document.querySelector(".masonry-grid");
    const masonry = new Masonry(grid, {
      itemSelector: ".board-game",
      columnWidth: 280,
      gutter: 20
    });
  }
  */

  render() {
    const {collection} = this.props;

    return (
      <div>
          {collection.map((boardgame, index) => {
              return (
                <BoardGame key={index} boardgame={boardgame} />
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
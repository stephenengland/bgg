import React from "react";

export default class BoardGame extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { boardgame } = this.props;

    return (
        <div className="board-game">
            <h4>{boardgame.name}</h4>
            <img src={boardgame.thumbnail} className="img-rounded" />
            <p>
            {boardgame.label}
            </p>
        </div>
    );
  }
}
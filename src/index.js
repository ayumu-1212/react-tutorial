import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  repRow(h, w) {
    const rows = [];
    for (let j = 0; j < h; j++) {
      rows.push(
        <div className="board-row">
          {this.repCol(j * w, (j+1) * w - 1)}
        </div>
      )
    }
    return rows;
  }

  repCol(s, e) {
    const cells = [];
    for (let i = s; i <= e; i++) {
      cells.push(this.renderSquare(i))
    }
    return cells;
  }


  render() {
    return (
      <div>
        {this.repRow(3, 3)}
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const[a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

class Toggle extends React.Component {
  render() {
    return (
      <button onClick={this.props.handleClick}>
        {this.props.isAsc ? "昇順" : "降順"}
      </button>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        id: 0,
        squares: Array(9).fill(null),
        who: "",
        col: 0,
        row: 0,
      }],
      stepNumber: 0,
      xIsNext: true,
      selected_index: null,
      isAsc: true,
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const who = this.state.xIsNext ? "X" : "O";
    const col = i % 3;
    const row = Math.floor(i / 3);
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = who;
    this.setState({
      history: history.concat([{
        id: history.length,
        squares: squares,
        who: who,
        col: col,
        row: row,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      selected_index: null,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      selected_index: step,
    })
  }

  switchToggle() {
    this.setState({
      isAsc: !this.state.isAsc,
    })
  }
  
  render() {
    let history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    if (!this.state.isAsc) {
      history = history.reduceRight((p, c) => [...p, c], []);
    }
    
    const moves = history.map((step, move) => {
      if (step.id === 0) {
        return;
      } else {
        const desc = "Go to move #" + step.id;
        const class_name = step.id === this.state.selected_index ? "bold-tr" : "";
        return (
          <tr key={move} className={class_name}>
            <td>
              {step.id}
            </td>
            <td>
              {step.who}
            </td>
            <td>
              {step.col + 1}
            </td>
            <td>
              {step.row + 1}
            </td>
            <td>
              <button onClick={() => this.jumpTo(step.id)} >{desc}</button>
            </td>
          </tr>
        )
      }
    })


    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="game-info-status">{status}</div>
          <div>
            <button className="go_first_button" onClick={() => this.jumpTo(0)} >Go to game start</button>
            <Toggle
              isAsc={this.state.isAsc}
              handleClick={() => this.switchToggle()}
            />
          </div>
          <table className='game-info-history'>
            <thead>
              <th>No.</th>
              <th>who</th>
              <th>col</th>
              <th>row</th>
              <th>trip</th>
            </thead>
            <tbody>
              {moves}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

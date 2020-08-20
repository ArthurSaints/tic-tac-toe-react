import React from "react";
import ReactDOM from "react-dom";

import "./index.css";

// class Square extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             value: null
//         };
//     }

//     render() {
//         return (
//             <button
//                 className="square"
//                 onClick={() => this.props.onClick()}
//             >
//                 {this.props.value}
//             </button>
//         );
//     }
// }

// SQUARE 2.0
function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
            style={(props.winnerRow) ? { color: "red" } : {}}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i, isWinnerRow) {
        return <Square
            winnerRow={isWinnerRow}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />
    }

    render() {
        let winner = this.props.winnerRows;
        let isWinner = winner != null;

        let rowsValues = [false, false, false,
            false, false, false,
            false, false, false];

        if (isWinner) {
            winner.map((row) => {
                return rowsValues[row] = true;
            });
        }

        return (
            <div>
                <div className="board-row">
                    <span>{this.renderSquare(0, rowsValues[0])}</span>
                    <span>{this.renderSquare(1, rowsValues[1])}</span>
                    <span>{this.renderSquare(2, rowsValues[2])}</span>
                </div>
                <div className="board-row">
                    <span>{this.renderSquare(3, rowsValues[3])}</span>
                    <span>{this.renderSquare(4, rowsValues[4])}</span>
                    <span>{this.renderSquare(5, rowsValues[5])}</span>
                </div>
                <div className="board-row">
                    <span>{this.renderSquare(6, rowsValues[6])}</span>
                    <span>{this.renderSquare(7, rowsValues[7])}</span>
                    <span>{this.renderSquare(8, rowsValues[8])}</span>
                </div>
            </div >
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                "Go to move #" + move :
                "Go to game start";

            return (
                <li key={move}>
                    <button
                        onClick={() => this.jumpTo(move)}
                    >
                        {desc}
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        //console.log(winner);
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        winnerRows={winner}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ===============

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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
        const [a, b, c] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            //console.log([a, b, c]);
            return [a, b, c];
        }
    }

    return null;
}
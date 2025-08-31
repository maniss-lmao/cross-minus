import { useState } from "react";
import Board from "./Board";

export default function Game() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const winner = calculateWinner(board);

  function handleClick(index) {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  }

  let status = winner
    ? `Winner: ${winner}`
    : board.every(Boolean)
    ? "It's a Draw!"
    : `Next Player: ${isXNext ? "X" : "O"}`;

  return (
    <div className="game">
      <h1>Tic Tac Toe</h1>
      <Board squares={board} onClick={handleClick} />
      <p className="status">{status}</p>
      <button className="reset" onClick={resetGame}>Reset Game</button>
    </div>
  );
}

// Winner logic
function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

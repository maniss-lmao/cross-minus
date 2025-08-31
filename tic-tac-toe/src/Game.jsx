import { useState, useEffect } from "react";
import Board from "./Board";

export default function Game() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  // ✅ Score state
  const [scoreX, setScoreX] = useState(0);
  const [scoreO, setScoreO] = useState(0);

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(Boolean);

  // ✅ Handle win/draw with useEffect (runs only once when state changes)
  useEffect(() => {
    if (winner) {
      if (winner === "X") setScoreX((prev) => prev + 1);
      if (winner === "O") setScoreO((prev) => prev + 1);

      // reset board after 1s
      setTimeout(() => resetBoard(), 1000);
    } else if (isDraw) {
      setTimeout(() => resetBoard(), 1000);
    }
  }, [winner, isDraw]);

  function handleClick(index) {
    if (board[index] || winner) return; // ignore if filled or won

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  }

  // ✅ Reset only board (for new round)
  function resetBoard() {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  }

  // ✅ Reset everything (scores + board)
  function resetGame() {
    resetBoard();
    setScoreX(0);
    setScoreO(0);
  }

  let status = winner
    ? `Winner: ${winner}`
    : isDraw
    ? "It's a Draw!"
    : `Next Player: ${isXNext ? "X" : "O"}`;

  return (
    <div className="game">
      <h1>Tic Tac Toe</h1>

      {/* ✅ Scoreboard */}
      <div className="scoreboard">
        <p>Player X: {scoreX}</p>
        <p>Player O: {scoreO}</p>
      </div>

      <Board squares={board} onClick={handleClick} />
      <p className="status">{status}</p>

      {/* ✅ Two reset buttons */}
      <button className="reset" onClick={resetBoard}>
        Reset Board
      </button>
      <button className="reset" onClick={resetGame}>
        Reset Game
      </button>
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

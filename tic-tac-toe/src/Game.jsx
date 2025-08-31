import { useState, useEffect } from "react";
import Board from "./Board";

export default function Game() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  // Scores
  const [scoreX, setScoreX] = useState(0);
  const [scoreO, setScoreO] = useState(0);

  //  New: Toggle PvP or PvC
  const [isVsComputer, setIsVsComputer] = useState(false);

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(Boolean);

  // Handle Win/Draw (scores + auto-reset board)
  useEffect(() => {
    if (winner) {
      if (winner === "X") setScoreX((prev) => prev + 1);
      if (winner === "O") setScoreO((prev) => prev + 1);

      setTimeout(() => resetBoard(), 1000);
    } else if (isDraw) {
      setTimeout(() => resetBoard(), 1000);
    }
  }, [winner, isDraw]);

  function handleClick(index) {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);

    //  Computer move (if enabled and it’s Computer’s turn)
    if (isVsComputer && isXNext) {
      setTimeout(() => {
        const aiMove = makeRandomMove(newBoard);
        if (aiMove !== undefined) {
          const updatedBoard = [...newBoard];
          updatedBoard[aiMove] = "O"; // Computer always O
          setBoard(updatedBoard);
          setIsXNext(true); // back to Player
        }
      }, 500); // small delay for realism
    }
  }

  // Reset only board
  function resetBoard() {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  }

  // Reset everything
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

      {/*  Game mode toggle */}
      <div className="mode-toggle">
        <button onClick={() => setIsVsComputer(!isVsComputer)}>
          {isVsComputer ? "Switch to 2 Players" : "Switch to Vs Computer"}
        </button>
      </div>

      {/* Scoreboard */}
      <div className="scoreboard">
        <p>Player X: {scoreX}</p>
        <p>{isVsComputer ? "Computer (O)" : "Player O"}: {scoreO}</p>
      </div>

      <Board squares={board} onClick={handleClick} />
      <p className="status">{status}</p>

      <button className="reset" onClick={resetBoard}>Reset Board</button>
      <button className="reset" onClick={resetGame}>Reset Game</button>
    </div>
  );
}

//  Random AI (easy mode)
function makeRandomMove(board) {
  const emptySquares = board
    .map((val, i) => (val === null ? i : null))
    .filter((val) => val !== null);

  if (emptySquares.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * emptySquares.length);
  return emptySquares[randomIndex];
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

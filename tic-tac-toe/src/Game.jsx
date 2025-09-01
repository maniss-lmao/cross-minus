import { useState, useEffect } from "react";
import Board from "./Board";

export default function Game() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  // Scores
  const [scoreX, setScoreX] = useState(0);
  const [scoreO, setScoreO] = useState(0);

  // Toggle PvP or PvC
  const [isVsComputer, setIsVsComputer] = useState(false);

  // Difficulty state
  const [difficulty, setDifficulty] = useState("easy");

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

    // Computer move (if enabled and it’s Computer’s turn)
    if (isVsComputer && isXNext) {
      setTimeout(() => {
        let aiMove;
        if (difficulty === "easy") {
          aiMove = makeRandomMove(newBoard);
        } else if (difficulty === "medium") {
          aiMove = makeMediumMove(newBoard);
        } else if (difficulty === "hard") {
          aiMove = makeBestMove(newBoard);
        }

        if (aiMove !== undefined) {
          const updatedBoard = [...newBoard];
          updatedBoard[aiMove] = "O"; // Computer always O
          setBoard(updatedBoard);
          setIsXNext(true); // back to Player
        }
      }, 500);
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

      {/* Game mode toggle */}
      <div className="mode-toggle">
        <button onClick={() => setIsVsComputer(!isVsComputer)}>
          {isVsComputer ? "Switch to 2 Players" : "Switch to Vs Computer"}
        </button>
      </div>

      {/* Difficulty selector (only if vs computer) */}
      {isVsComputer && (
        <div className="difficulty">
          <label>Difficulty: </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      )}

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

// Random AI (easy)
function makeRandomMove(board) {
  const emptySquares = board
    .map((val, i) => (val === null ? i : null))
    .filter((val) => val !== null);

  if (emptySquares.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * emptySquares.length);
  return emptySquares[randomIndex];
}

// Medium AI (win/block/random)
function makeMediumMove(board) {
  // Try to win
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const copy = [...board];
      copy[i] = "O";
      if (calculateWinner(copy) === "O") return i;
    }
  }

  // Try to block player
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const copy = [...board];
      copy[i] = "X";
      if (calculateWinner(copy) === "X") return i;
    }
  }

  // Otherwise random
  return makeRandomMove(board);
}

// Hard AI (minimax - unbeatable)
function makeBestMove(board) {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = "O"; // Computer's move
      let score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing) {
  const winner = calculateWinner(board);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (board.every(Boolean)) return 0; // Draw

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
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

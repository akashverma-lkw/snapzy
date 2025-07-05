import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoClose } from "react-icons/io5";

const TicTacToe = ({ isOpen, onClose }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    const win = calculateWinner(newBoard);
    if (win) {
      setWinner(win);
    } else {
      setIsXNext(false);
      setTimeout(() => aiMove(newBoard), 500);
    }
  };

  const aiMove = (currentBoard) => {
    const emptySquares = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    if (emptySquares.length === 0 || winner) return;
    const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    const newBoard = [...currentBoard];
    newBoard[randomIndex] = 'O';
    setBoard(newBoard);
    const win = calculateWinner(newBoard);
    if (win) {
      setWinner(win);
    } else {
      setIsXNext(true);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setIsGameStarted(true);
  };

  return (
    <>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50"
        >
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 p-6 rounded-lg shadow-lg w-80 text-center"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Play Tic Tac Toe</h2>
              <button onClick={onClose} className="text-white text-xl hover:text-red-500"><IoClose className='w-6 h-6'  /></button>
            </div>
            {!isGameStarted ? (
              <button
                className="btn btn-primary px-4 py-2 rounded-md"
                onClick={() => setIsGameStarted(true)}
              >
                Play Game
              </button>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2 w-40 mx-auto">
                  {board.map((square, idx) => (
                    <div
                      key={idx}
                      onClick={() => isXNext && handleClick(idx)}
                      className="w-12 h-12 flex items-center justify-center text-xl border border-gray-700 cursor-pointer hover:bg-gray-800"
                    >
                      {square}
                    </div>
                  ))}
                </div>
                {winner && <p className="mt-4 text-white">{winner} Wins!</p>}
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
                  onClick={resetGame}
                >
                  Reset Game
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default TicTacToe;

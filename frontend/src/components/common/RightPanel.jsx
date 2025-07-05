import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import LoadingSpinner from "./LoadingSpinner";
import { useState } from "react";

const TicTacToe = () => {
	const [board, setBoard] = useState(Array(9).fill(null));
	const [isXNext, setIsXNext] = useState(true);

	const handleClick = (index) => {
		if (board[index] || calculateWinner(board)) return;
		const newBoard = board.slice();
		newBoard[index] = isXNext ? "X" : "O";
		setBoard(newBoard);
		setIsXNext(!isXNext);
		setTimeout(() => aiMove(newBoard), 500);
	};

	const aiMove = (currentBoard) => {
		const emptySquares = currentBoard.map((val, idx) => (val === null ? idx : null)).filter((val) => val !== null);
		if (emptySquares.length === 0) return;
		const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)];
		currentBoard[randomIndex] = "O";
		setBoard(currentBoard);
		setIsXNext(true);
	};

	const calculateWinner = (squares) => {
		const lines = [
			[0, 1, 2], [3, 4, 5], [6, 7, 8],
			[0, 3, 6], [1, 4, 7], [2, 5, 8],
			[0, 4, 8], [2, 4, 6],
		];
		for (let line of lines) {
			const [a, b, c] = line;
			if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
				return squares[a];
			}
		}
		return null;
	};

	const winner = calculateWinner(board);

	return (
		<div className='mt-4 p-4 bg-gray-900 rounded-md'>
			<h3 className='text-white text-lg mb-2'>Tic Tac Toe</h3>
			<div className='grid grid-cols-3 gap-2 w-40 mx-auto'>
				{board.map((square, idx) => (
					<div
						key={idx}
						onClick={() => handleClick(idx)}
						className='w-12 h-12 flex items-center justify-center text-xl text-white border border-gray-700 cursor-pointer hover:bg-gray-800'
					>
						{square}
					</div>
				))}
			</div>
			{winner && <p className='text-white text-center mt-4'>{winner} Wins!</p>}
		</div>
	);
};

const RightPanel = () => {
	const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

	const { data: suggestedUsers, isLoading } = useQuery({
		queryKey: ["suggestedUsers"],
		queryFn: async () => {
			try {
				const res = await fetch(`${API_URL}/api/users/suggested`, {
					headers: {
					 Authorization: `Bearer ${localStorage.getItem("token")}`,
				}});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong!");
				}
				return data;
			} catch (error) {
				throw new Error(error.message);
			}
		},
	});

	const { follow, isPending } = useFollow();
	const [showGame, setShowGame] = useState(false);

	if (suggestedUsers?.length === 0) return <div className='md:w-64 w-0'></div>;

	return (
		<div className='hidden lg:block mt-24 my-4 mx-auto'>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				<p className='font-bold mb-2'>People you may know !</p>
				<div className='flex flex-col gap-4'>
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						suggestedUsers?.map((user) => (
							<Link
								to={`/profile/${user.username}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>{user.fullName}</span>
										<span className='text-sm text-slate-500'>@{user.username}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => {
											e.preventDefault();
											follow(user._id);
										}}
									>
										{isPending ? <LoadingSpinner size='sm' /> : "Follow"}
									</button>
								</div>
							</Link>
						))}
				</div>

			</div>
			<div className='flex flex-col gap-4'>
				{isLoading && (
					<>
					<div className='bg-[#16181C] p-4 rounded-md sticky top-2 mt-8'>
						<RightPanelSkeleton /></div>

					</>
				)}
				{!isLoading && (
					<div className='bg-[#16181C] p-4 rounded-md sticky top-2 mt-8'>
						<h3 className='text-white text-lg mb-2'>Want to play game ?  😎</h3>
						<button
							className='btn btn-primary text-white rounded-full w-full'
							onClick={() => setShowGame(!showGame)}
						>
							Play Tic Tac Toe
						</button>
						{showGame && <TicTacToe />}
					</div>
				)}

			</div>

		</div>
	);
};

export default RightPanel;

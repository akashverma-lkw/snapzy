import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorBoundary from '../../ErrorBoundry/ErrorBoundry'

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";


const NotificationPage = () => {
	const queryClient = useQueryClient();

	const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			const token = localStorage.getItem("token");

			const res = await fetch(`${API_URL}/api/notifications`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},

	});

	const { mutate: deleteNotifications } = useMutation({
		mutationFn: async () => {
			const token = localStorage.getItem("token");

			const res = await fetch(`${API_URL}/api/notifications`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},

		onSuccess: () => {
			toast.success("Notifications deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
		<>
			<Helmet>
				<title>Notification Page | Snapzy </title>
			</Helmet>
			<div className='flex-[4_4_0] border-l border-r mt-16 border-gray-700 min-h-screen w-full max-w-2xl mx-auto'>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<p className='font-bold'>Notifications</p>
					<div className='dropdown'>
						<div tabIndex={0} role='button' className='m-1'>
							<IoSettingsOutline className='w-4' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content absolute right-0 mt-2 z-10 menu p-2 shadow bg-base-100 rounded-lg w-52 max-w-[90vw] md:max-w-[80vw]'
						>
							<li>
								<a onClick={deleteNotifications} className="rounded-lg text-red-600">Delete all notifications</a>
							</li>
						</ul>
					</div>
				</div>
				{isLoading && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				{notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
				{notifications?.map((notification) => (
					<div className='border-b border-gray-700' key={notification._id}>
						<div className='flex gap-2 p-4'>
							{notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
							{notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
							<Link to={`/profile/${notification?.from?.username}`}>
								<div className='avatar'>
									<div className='w-8 rounded-full'>
										<img src={notification?.from?.profileImg || "/avatar-placeholder.png"} />
									</div>
								</div>
								<div className='flex gap-1'>
									<span className='font-bold'>@{notification?.from?.username}</span>{" "}
									{notification.type === "follow" ? "followed you" : "liked your post"}
								</div>
							</Link>
						</div>
					</div>
				))}
			</div>
		</>
	);
};
export default NotificationPage;

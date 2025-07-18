import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import ErrorBoundary from '../../ErrorBoundry/ErrorBoundry'

const Posts = ({ feedType, username, userId }) => {

	const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;


	const getPostEndpoint = () => {
		switch (feedType) {
			case "forYou":
				return `${API_URL}/api/posts/all`;
			case "following":
				return `${API_URL}/api/posts/following`;
			case "posts":
				return `${API_URL}/api/posts/user/${username}`;
			case "likes":
				return `${API_URL}/api/posts/likes/${userId}`;
			default:
				return `${API_URL}/api/posts/all`;
		}
	};

	const POST_ENDPOINT = getPostEndpoint();

	const {
		data: posts,
		isLoading,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			try {
				const res = await fetch(POST_ENDPOINT, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});

				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}

				return data;
			} catch (error) {
				throw new Error(error.message || "Failed to fetch posts");
			}
		},

	});

	useEffect(() => {
		refetch();
	}, [feedType, refetch, username]);

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && (
				<p className='text-center my-4'>No posts in this tab. Switch 👻</p>
			)}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<ErrorBoundary><Post key={post?._id} post={post} /></ErrorBoundary>
					))}
				</div>
			)}
		</>
	);
};
export default Posts;

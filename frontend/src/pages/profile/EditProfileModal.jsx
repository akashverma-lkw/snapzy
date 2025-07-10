import { useEffect, useState } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EditProfileModal = ({ authUser }) => {
	const [formData, setFormData] = useState({
		fullName: "",
		username: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
	});
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();
	const navigate = useNavigate();

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

	const confirmDeleteAccount = async () => {
		try {
			const token = localStorage.getItem("token");
			const res = await fetch(`${API_URL}/api/users/delete-account/${authUser._id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				credentials: "include",
			});

			const data = await res.json();
			if (res.ok) {
				toast.success("Account deleted successfully");
				localStorage.removeItem("token");
				navigate("/");
				window.location.reload();
			} else {
				toast.error(data.message || "Failed to delete account");
			}
		} catch (error) {
			toast.error("Something went wrong");
		}
	};


	useEffect(() => {
		if (authUser) {
			setFormData({
				fullName: authUser.fullName,
				username: authUser.username,
				bio: authUser.bio,
				link: authUser.link,
				newPassword: "",
				currentPassword: "",
			});
		}
	}, [authUser]);

	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>

			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box relative border rounded-md border-gray-700 shadow-md w-full max-w-md'>

					{/* Close Button */}
					<form method='dialog' className='absolute right-2 top-2'>
						<button className='text-gray-500 hover:text-red-500 text-xl font-bold'>&times;</button>
					</form>

					<h3 className='font-bold text-lg my-3'>Update Profile</h3>

					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							updateProfile(formData);
						}}
					>
						<div className='flex flex-col gap-2'>
							<label htmlFor='fullName'>Full Name</label>
							<input
								id='fullName'
								type='text'
								placeholder='Full Name'
								className='input border border-gray-700 rounded p-2 input-md w-full'
								value={formData.fullName}
								name='fullName'
								onChange={handleInputChange}
							/>

							<label htmlFor='username'>Username</label>
							<input
								id='username'
								type='text'
								placeholder='Username'
								className='input border border-gray-700 rounded p-2 input-md w-full'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						</div>

						<div className='flex flex-col gap-2'>
							<label htmlFor='bio'>Bio</label>
							<textarea
								id='bio'
								placeholder='Bio'
								className='input border border-gray-700 rounded p-2 input-md w-full'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>

						<div className='flex flex-col gap-2'>
							<label htmlFor='currentPassword'>Current Password</label>
							<input
								id='currentPassword'
								type='password'
								placeholder='Current Password'
								className='input border border-gray-700 rounded p-2 input-md w-full'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>

							<label htmlFor='newPassword'>New Password</label>
							<input
								id='newPassword'
								type='password'
								placeholder='New Password'
								className='input border border-gray-700 rounded p-2 input-md w-full'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
						</div>

						<label htmlFor='link'>Link</label>
						<input
							id='link'
							type='text'
							placeholder='Link'
							className='input border border-gray-700 rounded p-2 input-md w-full'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>

						<button className='btn btn-primary rounded-full btn-sm text-white'>
							{isUpdatingProfile ? "Updating..." : "Update"}
						</button>

						<hr className='my-2' />

						<button
							type='button'
							className='btn btn-error rounded-full btn-sm text-white'
							onClick={() => {
								document.getElementById("edit_profile_modal").close();
								setShowDeleteConfirm(true);
							}}
						>
							Delete My Account
						</button>
					</form>

				</div>

				{/* Backdrop for closing the modal */}
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>

			{/* Delete Confirmation Modal */}
			{showDeleteConfirm && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
					<div className='bg-white p-6 rounded-lg shadow-lg max-w-sm w-full'>
						<h3 className='text-lg font-semibold text-red-600 mb-4'>Are you sure?</h3>
						<p className='mb-6 text-gray-700'>
							This action cannot be undone. Your account will be permanently deleted.
						</p>
						<div className='flex justify-end gap-3'>
							<button
								onClick={() => setShowDeleteConfirm(false)}
								className='px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800'
							>
								Cancel
							</button>
							<button
								onClick={confirmDeleteAccount}
								className='px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white'
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default EditProfileModal;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: false,
			unique: true,
		},
		fullName: {
			type: String,
			required: false,
			unique: true,
		},
		password: {
			type: String,
			required: false,
			minLength: 6,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
		profileImg: {
			type: String,
			default: "",
		},
		coverImg: {
			type: String,
			default: "",
		},
		bio: {
			type: String,
			default: "",
		},
		link: {
			type: String,
			default: "",
		},
		likedPosts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Post",
				default: [],
			},
		],
		otp: {
			type: String,
		},
		otpExpiry: {
			type: Date,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

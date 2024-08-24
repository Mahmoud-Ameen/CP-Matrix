import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	googleId: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	lastLogin: {
		type: Date,
		default: Date.now,
	},
});

userSchema.index("googleId");
userSchema.index("email");

const User = mongoose.model("User", userSchema);

export default User;

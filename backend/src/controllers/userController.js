import User from "../models/user.js";

export const registerOrUpdateUser = async (req, res) => {
	const { name, picture, email, user_id, auth_time } = req.authenticatedUser;
	try {
		let user = await User.findOne({ googleId: user_id });
		if (!user) {
			user = User.create({
				googleId: user_id,
				name,
				avatar: picture,
				email,
				lastLogin: auth_time,
				createdAt: auth_time,
			});
			user.save();
		} else {
			user.lastLogin = Date.now();
			user.name = name;
			user.avatar = picture;
			user.save();
		}

		return res.json("Mashy ya kbeer");
	} catch (error) {
		console.error(error);
		return res.status(500).json("Internal Error");
	}
};

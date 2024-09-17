import { Request, Response } from "express";
import User from "../models/user.js";

export const registerOrUpdateUser = async (req: Request, res: Response) => {
	if (!req.authenticatedUser) {
		return res.status(401).send("Unauthorized: No token provided");
	}

	const { name, picture, email, user_id, auth_time } = req.authenticatedUser;
	try {
		let user = await User.findOne({ googleId: user_id });
		if (!user) {
			user = await User.create({
				googleId: user_id,
				name,
				avatar: picture,
				email,
				lastLogin: auth_time,
				createdAt: auth_time,
			});
			user.save();
		} else {
			user.lastLogin = new Date();
			user.name = name;
			user.avatar = picture;
			user.save();
		}

	} catch (error) {
		console.error(error);
		return res.status(500).json("Internal Error");
	}
};



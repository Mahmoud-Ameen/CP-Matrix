import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase.js";
import { AuthenticatedUser } from "../types/auth.js";


const verifyFirebaseToken = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization?.split("Bearer ")[1];

	if (!token) return res.status(401).send("Unauthorized: No token provided");

	try {
		const decodedToken = await admin.auth().verifyIdToken(token);

		req.authenticatedUser = decodedToken as unknown as AuthenticatedUser;
		next();
	} catch (error) {
		console.error("Error verifying Firebase ID token:", error);
		return res.status(401).send("Unauthorized: Invalid token");
	}
};

export default verifyFirebaseToken;

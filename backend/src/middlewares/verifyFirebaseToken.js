import admin from "../config/firebase.js";

const verifyFirebaseToken = async (req, res, next) => {
	const token = req.headers.authorization?.split("Bearer ")[1];

	if (!token) return res.status(401).send("Unauthorized: No token provided");

	try {
		const decodedToken = await admin.auth().verifyIdToken(token);

		req.authenticatedUser = decodedToken; // Attach decoded token to request
		next();
	} catch (error) {
		console.error("Error verifying Firebase ID token:", error);
		return res.status(401).send("Unauthorized: Invalid token");
	}
};

export default verifyFirebaseToken;

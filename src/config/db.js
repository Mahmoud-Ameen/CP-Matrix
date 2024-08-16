import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

const connectToDatabase = async () => {
	mongoose
		.connect(uri)
		.then(() => {
			console.log("Connected to MongoDB");
		})
		.catch((error) => {
			console.error("Error connecting to MongoDB:", error);
			process.exit(1);
		});
};

const disconnectFromDatabase = async () => {
	try {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	} catch (error) {
		console.error("Error disconnecting from MongoDB:", error);
	}
};

export { connectToDatabase, disconnectFromDatabase };

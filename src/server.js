// Libraries
import express, { json } from "express";

// Config files
import { connectToDatabase, disconnectFromDatabase } from "./config/db.js";

// Route files
import problemRoutes from "./routes/problemRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(json());

// Routers
app.use("/api/problems", problemRoutes);

// Event listeners for Shutting down the app
const shutdown = async () => {
	await disconnectFromDatabase();
	process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Connect to db and start the server
try {
	await connectToDatabase();
	app.listen(PORT, () => {
		console.log(`Server running on http://localhost:${PORT}`);
	});
} catch (error) {
	console.error("Failed to connect to the database:", error);
	process.exit(1);
}

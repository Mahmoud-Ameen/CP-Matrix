// Libraries
import express, { json } from "express";
import cors from "cors";
import compression from "compression";

// Config files
import { connectToDatabase, disconnectFromDatabase } from "./config/db.js";

// Route files
import problemRoutes from "./routes/problemRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import timingMiddleware from "./middlewares/timingMiddleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(json());
app.use(cors());
app.use(compression());
app.use(timingMiddleware);

// Routers
app.use("/api/problems", problemRoutes);
app.use("/api/users", userRoutes);

// Event listeners for shutting down the app gracefully
const shutdown = async () => {
  await disconnectFromDatabase();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Connect to the database and start the server
const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

startServer();
import mongoose from "mongoose";
import * as dotenv from "dotenv";

// Load environment variables from the `.env` file
dotenv.config({
  path: "./src/secrets/.env",
});

// Define the URI for MongoDB
const uri: string | undefined = process.env.MONGODB_URI;

// Check if the URI is available, if not, throw an error.
if (!uri) {
  throw new Error("MONGODB_URI is not defined in the environment variables.");
}

// Function to connect to the database
const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with failure
  }
};

// Function to disconnect from the database
const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
};

export { connectToDatabase, disconnectFromDatabase };

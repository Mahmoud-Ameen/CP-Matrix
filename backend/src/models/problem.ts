import mongoose, { Document, Schema, Model } from "mongoose";

// Define a TypeScript interface for Problem document
interface IProblem extends Document {
	contestId: number;
	index: string;
	name: string;
	type: string;
	tags: string[] | null;
	rating: number | null;
	division: string;
	problemId: string;
}

// Define the schema for Problem
const problemSchema: Schema<IProblem> = new mongoose.Schema({
	contestId: { type: Number, required: true },
	index: { type: String, required: true },
	name: { type: String, required: true },
	type: { type: String, required: true }, // "A,B,C,..."
	tags: { type: [String], default: [] },
	rating: { type: Number, default: null },
	division: { type: String },
	problemId: { type: String, required: true, unique: true },
});

// Indexes 
problemSchema.index({ contestId: 1 });
problemSchema.index({ rating: 1 });
problemSchema.index({ problemId: 1 });

// Export the model
const Problem: Model<IProblem> = mongoose.model<IProblem>("Problem", problemSchema);
export default Problem;

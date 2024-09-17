import mongoose, { Document, Schema, Model } from "mongoose";

// Define a TypeScript interface for Contest document
interface IContest extends Document {
  id: number;
  name: string;
  type: string;
  division: "div1" | "div2" | "div3" | "div4";
}

// Define the schema for Contest
const contestSchema: Schema<IContest> = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  division: {
    type: String,
    enum: ["div1", "div2", "div3", "div4"],
    required: true,
  },
});

// Index 
contestSchema.index({ id: 1 }, { unique: true });

// Export the model
const Contest: Model<IContest> = mongoose.model<IContest>("Contest", contestSchema);
export default Contest;

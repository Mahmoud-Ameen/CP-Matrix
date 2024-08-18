import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
	contestId: { type: Number, required: true },
	index: { type: String, required: true },
	name: { type: String, required: true },
	type: { type: String, required: true }, // "A,B,C,..."
	tags: { type: [String], default: [] },
	rating: { type: Number, default: null },
	division: { type: String, default: null },
});

const Problem = mongoose.model("Problem", problemSchema);

problemSchema.index({ contestId: 1 });
problemSchema.index({ rating: 1 });

export default Problem;

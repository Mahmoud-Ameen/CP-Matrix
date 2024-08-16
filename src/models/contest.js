import mongoose from "mongoose";

const contestSchema = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	name: { type: String, required: true },
	type: { type: String, required: true },
	division: { type: String, enum: ["div1", "div2", "div3", "div4", "div1+2"], required: true },
});

contestSchema.index({ id: 1 }, { unique: true });

const Contest = mongoose.model("Contest", contestSchema);
export default Contest;

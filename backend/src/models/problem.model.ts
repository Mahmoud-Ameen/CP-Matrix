import mongoose, { Document, Schema, Model } from 'mongoose'

// Define a TypeScript interface for Problem document
interface IProblemDoc extends Document {
	contestId: number
	index: string
	name: string
	tags?: string[] | null
	rating?: number | null
	division: 'div1' | 'div2' | 'div3' | 'div4' | 'other'
	problemId: string
}

// Define the schema for Problem
const problemSchema: Schema<IProblemDoc> = new mongoose.Schema({
	contestId: { type: Number, required: true },
	index: { type: String, required: true }, // "A,B,C,..."
	name: { type: String, required: true },
	tags: { type: [String], default: [] },
	rating: { type: Number, default: null },
	division: { type: String, enum: ['div1', 'div2', 'div3', 'div4', 'other'], default: 'other' },
	problemId: { type: String, required: true, unique: true },
})

// Indexes
problemSchema.index({ contestId: 1 })
problemSchema.index({ rating: 1 })
problemSchema.index({ problemId: 1 })

// Export the model
const Problem: Model<IProblemDoc> = mongoose.model<IProblemDoc>('Problem', problemSchema)
export default Problem

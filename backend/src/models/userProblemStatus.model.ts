import mongoose, { Document, Schema, Model } from 'mongoose'
import { ProblemStatus } from '../types/shared'

// Define a TypeScript interface for the UserProblemStatus document
interface IUserProblemStatusDocument extends Document {
	codeforcesHandle: string
	problemId: string
	status: ProblemStatus.SOLVED | ProblemStatus.ATTEMPTED
}

// Create a Mongoose schema for UserProblemStatus
const userProblemStatusSchema = new Schema<IUserProblemStatusDocument>({
	codeforcesHandle: {
		type: String,
		required: true,
		set: (v: string) => v.toLowerCase(),
		get: (v: string) => v.toLowerCase(),
	},
	problemId: { type: String, required: true },
	status: { type: String, enum: [ProblemStatus.SOLVED, ProblemStatus.ATTEMPTED], required: true },
})

// compound index on codeforcesHandle and problemId to ensure uniqueness and quick lookups by codeforcesHandle
userProblemStatusSchema.index({ codeforcesHandle: 1, problemId: 1 }, { unique: true })
// coumpound index on codeforcesHandle and status for quick lookup by handle and status
userProblemStatusSchema.index({ codeforcesHandle: 1, status: 1 })

const userProblemStatusModel: Model<IUserProblemStatusDocument> = mongoose.model<IUserProblemStatusDocument>(
	'UserProblemStatus',
	userProblemStatusSchema
)

export default userProblemStatusModel

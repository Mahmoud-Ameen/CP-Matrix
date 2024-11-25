import mongoose from 'mongoose'
import { ICFAccountInfo } from '../types/shared'

const CFAccountInfoSchema = new mongoose.Schema<ICFAccountInfo>(
	{
		codeforcesHandle: {
			type: String,
			required: true,
			unique: true,
			set: (v: string) => v.toLowerCase(),
			get: (v: string) => v.toLowerCase(),
		},
		lastProcessedSubmissionId: { type: Number }, // Track the index of last processed user submission
	},
	{ timestamps: true }
)

const CFAccountInfo = mongoose.model<ICFAccountInfo>('CFAccountInfo', CFAccountInfoSchema)

export default CFAccountInfo

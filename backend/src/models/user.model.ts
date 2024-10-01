import mongoose, { Document, Schema, Model } from 'mongoose'

interface IUser extends Document {
	googleId: string
	email: string
	name: string
	avatar?: string
	createdAt: Date
	lastLogin: Date
}

const userSchema: Schema<IUser> = new mongoose.Schema({
	googleId: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	lastLogin: {
		type: Date,
		default: Date.now,
	},
})

// Indexes
userSchema.index({ googleId: 1 })
userSchema.index({ email: 1 })

// Export the model
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema)
export default User

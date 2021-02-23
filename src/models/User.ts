import mongoose from 'mongoose'

type UserType = mongoose.Document &
{
	_id: string
	email: string
	image?: string
	name?: string
	changedName: boolean
	joinedAt?: Date
}

const UserSchema = new mongoose.Schema(
{
	email: {type: String, required: true, unique: true},
	image: {type: String},
	name: {type: String},
	changedName: {type: Boolean, default: false},
	joinedAt: {type: Date, default: Date.now()},
})

export default mongoose.model<UserType>('User', UserSchema)
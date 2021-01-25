import mongoose from 'mongoose'

type MemberType = mongoose.Document &
{
	_id: string
	name: string
	image?: string
	role: string
	admin: boolean
	bio: string
	favTopics: string[]
}

const MemberSchema = new mongoose.Schema(
{
	name: {type: String, required: true},
	image: {type: String, required: false},
	role: {type: String, required: true},
	admin: {type: Boolean, required: true},
	bio: {type: String, required: true},
	favTopics: [{type: String}]
})

export default mongoose.model<MemberType>('Member', MemberSchema)
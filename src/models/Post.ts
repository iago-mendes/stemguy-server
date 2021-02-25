import mongoose from 'mongoose'

export type PostType = mongoose.Document & 
{
	_id: string
	url_id: string
	title: string
	date: string
	time: number
	author: string
	description: string
	image: string
	markdown: string
	flags: Array<string>
	comments?: Array<
	{
		_id?: string
		userEmail: string
		text: string
		replies: Array<
		{
			_id?: string
			userEmail: string
			isMember: boolean
			text: string
		}>
	}>
}

const PostSchema = new mongoose.Schema(
{
	url_id: {type: String, required: true, unique: true},
	title: {type: String, required: true},
	date: {type: String, required: true},
	time: {type: Number, required: true},
	author: {type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true},
	description: {type: String, required: true},
	image: {type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: true},
	markdown: {type: String, required: true},
	flags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Flag'}],
	comments:
	[{
		userEmail: {type: String, required: true},
		text: {type: String, required: true},
		replies:
		[{
			userEmail: {type: String, required: true},
			isMember: {type: Boolean, required: true},
			text: {type: String, required: true}
		}]
	}]
})
PostSchema.index({title: 'text', description: 'text', markdown: 'text'})

export default mongoose.model<PostType>('Post', PostSchema)
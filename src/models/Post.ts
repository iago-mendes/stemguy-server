import mongoose from 'mongoose'

export type PostType = mongoose.Document & 
{
	_id: string
	url_id: string
	title: string
	date: Date
	time: number
	author: string
	description: string
	image: string
	markdown: string
	flags: Array<string>
}

const PostSchema = new mongoose.Schema(
{
	url_id: {type: String, required: true, unique: true},
    title: {type: String, required: true},
	date: {type: Date, default: Date.now()},
	time: {type: Number, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true},
    description: {type: String, required: true},
    image: {type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: true},
	markdown: {type: String, required: true},
	flags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Flag'}]
})

export default mongoose.model<PostType>('Post', PostSchema)
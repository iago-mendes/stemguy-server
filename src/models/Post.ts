import mongoose from 'mongoose'

type PostType = mongoose.Document & 
{
	_id: string
	title: string
	date?: Date
	time: number
	author: string
	description: string
	image: string
	markdown: string
}

const PostSchema = new mongoose.Schema(
{
    title: {type: String, required: true},
	date: {type: Date, default: Date.now()},
	time: {type: Number, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true},
    description: {type: String, required: true},
    image: {type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: true},
    markdown: {type: String, required: true}
})

export default mongoose.model<PostType>('Post', PostSchema)
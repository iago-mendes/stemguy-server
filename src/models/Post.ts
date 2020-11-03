import mongoose from 'mongoose'

type PostType = mongoose.Document & 
{
	_id: string
	date: Date
	author: string
	title: string
	description: string
	image: string
	markdown: string
}

const PostSchema = new mongoose.Schema(
{
    date: {type: Date, default: Date.now(), required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: mongoose.Schema.Types.ObjectId, ref: 'image', required: true},
    markdown: {type: String, required: true}
})

export default mongoose.model<PostType>('Post', PostSchema)
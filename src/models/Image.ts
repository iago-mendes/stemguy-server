import mongoose from 'mongoose'

type ImageType = mongoose.Document &
{
	_id: string
	filename: string
	alt: string
	credit?: string
	creditLink?: string
	posts: Array<string>
}

const ImageSchema = new mongoose.Schema(
{
    filename: {type: String, required: true},
    alt: {type: String, required: true},
    credit: {type: String, required: false},
    creditLink: {type: String, required: false},
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}]
})

export default mongoose.model<ImageType>('Image', ImageSchema)
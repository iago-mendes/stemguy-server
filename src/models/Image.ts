import mongoose from 'mongoose'

type ImageType = mongoose.Document &
{
	_id: string
	filename: string
	alt: string
	credit?: string
	creditLink?: string
	width: number
	height: number
	date?: Date
}

const ImageSchema = new mongoose.Schema(
{
	filename: {type: String, required: true},
	alt: {type: String, required: true},
	credit: {type: String, required: false},
	creditLink: {type: String, required: false},
	width: {type: Number, required: true},
	height: {type: Number, required: true},
	date: {type: Date, default: Date.now()},
})
ImageSchema.index({alt: 'text'})

export default mongoose.model<ImageType>('Image', ImageSchema)
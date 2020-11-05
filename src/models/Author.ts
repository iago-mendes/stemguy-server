import mongoose from 'mongoose'

type AuthorType = mongoose.Document &
{
	_id: string
	name: string
	role: string
	image?: string
}

const AuthorSchema = new mongoose.Schema(
{
    name: {type: String, required: true},
    role: {type: String, required: true},
    image: {type: String, required: false}
})

export default mongoose.model<AuthorType>('Author', AuthorSchema)
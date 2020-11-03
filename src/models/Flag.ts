import mongoose from 'mongoose'

export type FlagType = mongoose.Document & 
{
	_id: string
    name: string
    color: string
}

const FlagSchema = new mongoose.Schema(
{
	name: {type: String, required: true, unique: true},
    color: {type: String, required: true}
})

export default mongoose.model<FlagType>('Flag', FlagSchema)
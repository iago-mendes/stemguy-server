import {Request, Response} from 'express'
import fs from 'fs'
import path from 'path'

import Member from '../models/Member'
import formatImage from '../utils/formatImage'

export default
{
	async create(req: Request, res: Response)
	{
		const {name, role, admin, bio, favTopics} = req.body
		const upload = req.file

		let image
		if (upload)
			image = upload.filename
		
		const member = await Member.create({name, image, role, admin, bio, favTopics: JSON.parse(favTopics)})
		return res.status(201).json(member)
	},

	async update(req: Request, res: Response)
	{
		const {id} = req.params
		const {name, role, admin, bio, favTopics} = req.body
		const upload = req.file

		let image
		const previous = await Member.findById(id)
		if (previous)
		{
			if (upload && previous.image)
			{
				fs.unlinkSync(path.join(__dirname, '..', '..', 'uploads', previous.image))
				image = upload.filename
			}
			else if (upload)
				image = upload.filename
			else if (previous.image)
				image = previous.image
		}

		const member = await Member.findByIdAndUpdate(id, {name, image, role, admin, bio, favTopics: JSON.parse(favTopics)}, {new: true})
		return res.status(200).json(member)
	},

	async remove(req: Request, res: Response)
	{
		const {id} = req.params

		const previous = await Member.findById(id)
		if (previous?.image)
			fs.unlinkSync(path.join(__dirname, '..', '..', 'uploads', previous.image))

		const tmp = await Member.findByIdAndDelete(id)
		res.status(200).send()
		return tmp
	},

	async list(req: Request, res: Response)
	{
		const members = await Member.find()

		const list = members.map(member => (
		{
			id: member._id,
			name: member.name,
			image: formatImage(member.image),
			role: member.role,
			bio: member.bio,
			favTopics: member.favTopics
		}))

		return res.json(list)
	},

	async show(req: Request, res: Response)
	{
		const {id} = req.params

		const member = await Member.findById(id)
		if (!member)
			return res.status(404).json({message: 'Member not found!'})

		const show =
		{
			id: member._id,
			name: member.name,
			image: formatImage(member.image),
			role: member.role,
			admin: member.admin,
			bio: member.bio,
			favTopics: member.favTopics
		}

		return res.json(show)
	}
}
import {Request, Response} from 'express'
import fs from 'fs'
import path from 'path'
import sizeOf from 'image-size'

import Image from '../models/Image'
import baseUrl from '../config/baseUrl'

interface List
{
	id: string
	url: string
	alt: string
	credit: string | undefined
	creditLink: string | undefined
	width: number
	height: number
	date: string
}

export default
{
	async create(req: Request, res: Response)
	{
		const {filename} = req.file
		const {alt, credit, creditLink, date} = req.body
		
		const {width, height} = sizeOf(path.join(__dirname, '..', '..', 'uploads', filename))
		if (!width || !height) return res.status(500).json({message: 'An error occurred while getting image dimensions'})

		const image = await Image.create({filename, alt, credit, creditLink, date, width, height})
		return res.status(201).json({url: `${baseUrl}/uploads/${image.filename}`, id: image._id})
	},

	async update(req: Request, res: Response)
	{
		const {id} = req.params
		const upload = req.file
		const {alt, credit, creditLink} = req.body

		let filename = ''
		const previous = await Image.findById(id)
		if (previous)
		{
			if (upload)
			{
				filename = upload.filename
				fs.unlinkSync(path.join(__dirname, '..', '..', 'uploads', previous.filename))
			}
			else filename = previous.filename
		}
		
		const image = await Image.findByIdAndUpdate(id, {filename, alt, credit, creditLink}, {new: true})
		return res.status(200).json(image)
	},

	async remove(req: Request, res: Response)
	{
		const {id} = req.params

		const previous = await Image.findById(id)
		if (previous) fs.unlinkSync(path.join(__dirname, '..', '..', 'uploads', previous.filename))

		const tmp = await Image.findByIdAndDelete(id)
		res.status(200).send()
		return tmp
	},

	async list(req: Request, res: Response)
	{
		const {search: requestedSeach, page: requestedPage} = req.query

		let search: string | undefined
		if (requestedSeach)
			search = String(requestedSeach)

		const filter = search ? {$text: {$search: search}} : {}
		const imagesAll = await Image.find(filter)

		imagesAll.sort((a, b) => a.date < b.date ? 1 : -1)
		const postsPerPage = 12
		const totalPages = Math.ceil(imagesAll.length / postsPerPage)
		res.setHeader('totalPages', totalPages)

		let page = 1
		if (requestedPage)
			page = Number(requestedPage)

		if (!(page > 0 && page <= totalPages))
			return res.status(400).json({message: 'requested page is invalid!'})
		res.setHeader('page', page)

		const sliceStart = (page - 1) * postsPerPage
		const images = imagesAll.slice(sliceStart, sliceStart + postsPerPage)

		const list: List[] = images.map(image => (
		{
			id: image._id,
			url: `${baseUrl}/uploads/${image.filename}`,
			alt: image.alt,
			credit: image.credit,
			creditLink: image.creditLink,
			width: image.width,
			height: image.height,
			date: image.date
		}
		))

		return res.json(list)
	}
}
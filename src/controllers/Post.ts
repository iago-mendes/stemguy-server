import {Request, Response} from 'express'

import Post from '../models/Post'
import Flag from '../models/Flag'
import Image from '../models/Image'
import Member from '../models/Member'
import formatImage from '../utils/formatImage'
import getDate from '../utils/getDate'

interface List
{
	id: string
	url_id: string
	title: string
	description: string
	image:
	{
		url: string
		alt: string
		width: number
		height: number
	}
	date: string
	flags: Array<{name: string, color: string}>
}

async function listPosts(req: Request, res: Response, showAll = false)
{
	const {flags: stringedFlags, search: searchString, page: requestedPage} = req.query

	let flags: string[] = []
	if (stringedFlags)
		flags = JSON.parse(String(stringedFlags))
	
	let search: string | undefined
	if (searchString)
		search = String(searchString)
	
	const filter = search ? {$text: {$search: search}} : {}
	const postsAll = showAll
		? await Post.find(filter)
		: (await Post.find(filter)).filter(({date}) => date <= getDate())

	if (postsAll.length === 0)
		return res.json([])

	postsAll.sort((a, b) => a.date < b.date ? 1 : -1)
	const postsPerPage = 8
	const totalPages = Math.ceil(postsAll.length / postsPerPage)
	res.setHeader('totalPages', totalPages)

	let page = 1
	if (requestedPage)
		page = Number(requestedPage)

	if (!(page > 0 && page <= totalPages))
		return res.status(400).json({message: 'requested page is invalid!'})
	res.setHeader('page', page)

	const sliceStart = (page - 1) * postsPerPage
	const posts = postsAll.slice(sliceStart, sliceStart + postsPerPage)

	let list: List[] = []
	const promises = posts.map(async post =>
	{
		let includesFlags = flags.every(flag => post.flags.includes(flag))

		let flagList: Array<{name: string, color: string}> = []
		const promises2 = post.flags.map(async flagId =>
		{
			let flag = await Flag.findById(flagId)
			if (flag) flagList.push({name: flag.name, color: flag.color})
		})
		await Promise.all(promises2)

		if (includesFlags || flags.length === 0)
		{
			const image = await Image.findById(post.image)
			if (image) list.push(
			{
				id: post._id,
				url_id: post.url_id,
				title: post.title,
				description: post.description,
				date: post.date,
				image:
				{
					url: formatImage(image.filename),
					alt: image.alt,
					width: image.width,
					height: image.height
				},
				flags: flagList
			})
		}
	})
	await Promise.all(promises)

	return res.json(list)
}

export default
{
	async create(req: Request, res: Response)
	{
		const {url_id, title, date, time, author, description, image, markdown, flags} = req.body
		const post = await Post.create({url_id, title, date, time, author, description, image, markdown, flags})
		return res.status(201).json(post)
	},

	async update(req: Request, res: Response)
	{
		const {id} = req.params
		const {url_id, title, date, time, author, description, image, markdown, flags} = req.body
		const tmp = await Post.findByIdAndUpdate(id,
			{_id: id, url_id, title, date, time, author, description, image, markdown, flags})
		res.status(200).send()
		return tmp
	},

	async remove(req: Request, res: Response)
	{
		const {id} = req.params
		const tmp = await Post.findByIdAndDelete(id)
		res.status(200).send()
		return tmp
	},

	async list(req: Request, res: Response)
	{
		const response = await listPosts(req, res)
		return response
	},

	async listAll(req: Request, res: Response)
	{
		const response = await listPosts(req, res, true)
		return response
	},

	async show(req: Request, res: Response)
	{
		const {urlId} = req.params

		const post = await Post.findOne({url_id: urlId})
		if (!post)
			return res.status(404).json({message: 'Post not found!'})

		let flags: Array<{name: string, color: string}> = []
		const promises = post.flags.map(async flagId =>
		{
			const flag = await Flag.findById(flagId)
			if (flag) flags.push({name: flag.name, color: flag.color})
		})
		await Promise.all(promises)

		const author = await Member.findById(post.author)
		if (!author)
			return res.status(404).json({message: 'Author not found!'})

		const image = await Image.findById(post.image)
		if (!image)
			return res.status(404).json({message: 'Image not found!'})

		return res.json(
		{
			title: post.title,
			date: post.date,
			time: post.time,
			author:
			{
				id: author._id,
				name: author.name,
				role: author.role,
				image: formatImage(author.image)
			},
			description: post.description,
			image:
			{
				url: formatImage(image.filename),
				alt: image.alt,
				credit: image.credit,
				creditLink: image.creditLink,
				width: image.width,
				height: image.height
			},
			markdown: post.markdown,
			flags
		})
	},

	async raw(req: Request, res: Response)
	{
		const posts = await Post.find()
		return res.json(posts)
	},

	async rawOne(req: Request, res: Response)
	{
		const {urlId} = req.params
		const post = await Post.findOne({url_id: urlId})
		return res.json(post)
	}
}
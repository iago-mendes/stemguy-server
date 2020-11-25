import {Request, Response} from 'express'

import Post from '../models/Post'
import Flag from '../models/Flag'
import Image from '../models/Image'
import Author from '../models/Author'
import baseUrl from '../config/baseUrl'

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
    flags: Array<{name: string, color: string}>
}

export default
{
    async create(req: Request, res: Response)
    {
        const {url_id, title, time, author, description, image, markdown, flags} = req.body
        const post = await Post.create({url_id, title, time, author, description, image, markdown, flags})
        return res.status(201).json(post)
    },

    async update(req: Request, res: Response)
    {
        const {id} = req.params
        const {url_id, title, time, author, description, image, markdown, flags} = req.body
        const tmp = await Post.findByIdAndUpdate(id,
            {_id: id, url_id, title, time, author, description, image, markdown, flags})
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
        const {flags: sflags, search: searchString} = req.query
        let flags: string[] = []
        if (sflags) flags = JSON.parse(String(sflags))
				
				let search: string | undefined = undefined
				if (searchString) search = String(searchString)
				
				const filter = search ? {$text: {$search: search}} : {}
        const posts = await Post.find(filter)

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
										image:
										{
											url: `${baseUrl}/uploads/${image.filename}`,
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
    },

    async show(req: Request, res: Response)
    {
        const {urlId} = req.params

        const post = await Post.findOne({url_id: urlId})
        if (!post) return res.status(404).json({message: 'Post not found!'})

        let flags: Array<{name: string, color: string}> = []
        const promises = post.flags.map(async flagId =>
        {
            const flag = await Flag.findById(flagId)
            if (flag) flags.push({name: flag.name, color: flag.color})
        })
        await Promise.all(promises)

        const author = await Author.findById(post.author)
        if (!author) return res.status(404).json({message: 'Author not found!'})

        const image = await Image.findById(post.image)
        if (!image) return res.status(404).json({message: 'Image not found!'})

        return res.json(
        {
            title: post.title,
            date: post.date,
            time: post.time,
            author:
            {
							name: author.name,
							role: author.role,
							image: `${baseUrl}/uploads/${author.image}`
            },
            description: post.description,
            image:
            {
							url: `${baseUrl}/uploads/${image.filename}`,
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
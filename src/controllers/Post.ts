import {Request, Response} from 'express'

import Post from '../models/Post'
import Flag from '../models/Flag'

interface List
{
    id: string
    url_id: string
    title: string
    description: string
    image: string
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
        const {flags: sflags} = req.query
        let flags: string[] = []
        if (sflags) flags = JSON.parse(String(sflags))
        console.log('[flags]', flags)
        
        const posts = await Post.find()

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
                list.push(
                {
                    id: post._id,
                    url_id: post.url_id,
                    title: post.title,
                    description: post.description,
                    image: post.image,
                    flags: flagList
                })
            }
        })
        await Promise.all(promises)

        return res.json(list)
    },

    async show(req: Request, res: Response)
    {
        const {id} = req.params
        const post = await Post.findById(id)
        return res.json(post)
    }
}
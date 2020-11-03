import {Request, Response} from 'express'

import Post from '../models/Post'

interface List
{
    id: string
    url_id: string
    title: string
    description: string
    image: string
}

export default
{
    async create(req: Request, res: Response)
    {
        const {url_id, title, time, author, description, image, markdown} = req.body
        const post = await Post.create({url_id, title, time, author, description, image, markdown})
        return res.status(201).json(post)
    },

    async update(req: Request, res: Response)
    {
        const {id} = req.params
        const {url_id, title, time, author, description, image, markdown} = req.body
        const tmp = await Post.findByIdAndUpdate(id, {_id: id, url_id, title, time, author, description, image, markdown})
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
        const filters = req.query
        const posts = await Post.find(filters)

        let list: List[] = posts.map(post => (
        {
            id: post._id,
            url_id: post.url_id,
            title: post.title,
            description: post.description,
            image: post.image
        }))

        return res.json(list)
    },

    async show(req: Request, res: Response)
    {
        const {id} = req.params
        const post = await Post.findById(id)
        return res.json(post)
    }
}
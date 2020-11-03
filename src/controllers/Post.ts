import {Request, Response} from 'express'

import Post, {PostType} from '../models/Post'

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
        return res.json(posts)
    }
}
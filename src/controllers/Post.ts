import {Request, Response} from 'express'

import Post from '../models/Post'

export default
{
    async create(req: Request, res: Response)
    {
        const {title, time, author, description, image, markdown} = req.body
        const post = await Post.create({title, time, author, description, image, markdown})
        return res.status(201).json(post)
    }
}
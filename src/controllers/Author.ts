import {Request, Response} from 'express'

import Author from '../models/Author'

export default
{
    async create(req: Request, res: Response)
    {
        const {name, role, image} = req.body
        const author = await Author.create({name, role, image})
        return res.status(201).json(author)
    },

    async update(req: Request, res: Response)
    {
        const {id} = req.params
        const {name, role, image} = req.body
        const author = await Author.findByIdAndUpdate(id, {name, role, image}, {new: true})
        return res.status(200).json(author)
    },

    async remove(req: Request, res: Response)
    {
        const {id} = req.params
        const tmp = await Author.findByIdAndDelete(id)
        res.status(200).send()
        return tmp
    },

    async list(req: Request, res: Response)
    {
        const authors = await Author.find()
        return res.json(authors)
    }
}
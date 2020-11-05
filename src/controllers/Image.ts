import {Request, Response} from 'express'

import Image from '../models/Image'

export default
{
    async create(req: Request, res: Response)
    {
        const {filename, alt, credit, creditLink} = req.body
        const image = await Image.create({filename, alt, credit, creditLink, posts: []})
        return res.status(201).json(image)
    },

    async update(req: Request, res: Response)
    {
        const {id} = req.params
        const {filename, alt, credit, creditLink} = req.body
        const image = await Image.findByIdAndUpdate(id, {filename, alt, credit, creditLink, posts: []}, {new: true})
        return res.status(200).json(image)
    },

    async remove(req: Request, res: Response)
    {
        const {id} = req.params
        const tmp = await Image.findByIdAndDelete(id)
        res.status(200).send()
        return tmp
    },

    async list(req: Request, res: Response)
    {
        const images = await Image.find()
        return res.json(images)
    }
}
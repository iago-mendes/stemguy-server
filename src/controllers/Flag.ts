import {Request, Response} from 'express'

import Flag from '../models/Flag'

export default
{
    async create(req: Request, res: Response)
    {
        const {name, color} = req.body
        const flag = await Flag.create({name, color})
        return res.status(201).json(flag)
    },

    async update(req: Request, res: Response)
    {
        const {id} = req.params
        const {name, color} = req.body
        const flag = await Flag.findByIdAndUpdate(id, {name, color}, {new: true})
        return res.status(200).send(flag)
    },

    async remove(req: Request, res: Response)
    {
        const {id} = req.params
        const tmp = await Flag.findByIdAndDelete(id)
        res.status(200).send()
        return tmp
    },

    async list(req: Request, res: Response)
    {
        const flags = await Flag.find()
        return res.json(flags)
    }
}
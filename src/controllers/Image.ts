import {Request, Response} from 'express'
import fs from 'fs'
import path from 'path'

import Image from '../models/Image'
import baseUrl from '../config/baseUrl'

interface List
{
    id: string,
    url: string,
    alt: string,
    credit: string | undefined,
    creditLink: string | undefined,
    date: Date | undefined
}

export default
{
    async create(req: Request, res: Response)
    {
        const {filename} = req.file
        const {alt, credit, creditLink} = req.body
        const image = await Image.create({filename, alt, credit, creditLink, posts: []})
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
        const images = await Image.find()

        const list: List[] = images.map(image => (
            {
                id: image._id,
                url: `${baseUrl}/uploads/${image.filename}`,
                alt: image.alt,
                credit: image.credit,
                creditLink: image.creditLink,
                date: image.date
            }
        ))

        return res.json(list)
    }
}
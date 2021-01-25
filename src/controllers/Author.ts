import {Request, Response} from 'express'
import fs from 'fs'
import path from 'path'

import Author from '../models/Member'
import baseUrl from '../config/baseUrl'

interface List
{
    id: string
    name: string
    role: string
    image: string | undefined
}

export default
{
    async create(req: Request, res: Response)
    {
        const {name, role} = req.body
        const upload = req.file

        let image
        if (upload) image = upload.filename
        
        const author = await Author.create({name, role, image})
        return res.status(201).json(author)
    },

    async update(req: Request, res: Response)
    {
        const {id} = req.params
        const {name, role} = req.body
        const upload = req.file

        let image
        const previous = await Author.findById(id)
        if (previous)
        {
            if (upload && previous.image)
            {
                fs.unlinkSync(path.join(__dirname, '..', '..', 'uploads', previous.image))
                image = upload.filename
            }
            else if (upload) image = upload.filename
            else if (previous.image) image = previous.image
        }

        const author = await Author.findByIdAndUpdate(id, {name, role, image}, {new: true})
        return res.status(200).json(author)
    },

    async remove(req: Request, res: Response)
    {
        const {id} = req.params

        const previous = await Author.findById(id)
        if (previous?.image) fs.unlinkSync(path.join(__dirname, '..', '..', 'uploads', previous.image))

        const tmp = await Author.findByIdAndDelete(id)
        res.status(200).send()
        return tmp
    },

    async list(req: Request, res: Response)
    {
        const authors = await Author.find()

        let list: List[] = authors.map(author => (
        {
            id: author._id,
            name: author.name,
            role: author.role,
            image: `${baseUrl}/uploads/${author.image}`
        }))

        return res.json(list)
    }
}
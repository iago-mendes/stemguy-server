import {ErrorRequestHandler} from 'express'

const errorHandler: ErrorRequestHandler = (err, req, res, next) =>
{
    if (err.code === 11000) // duplicate
    {
        const keys = Object.keys(err.keyValue)
        const message = keys.map(key => `'${err.keyValue[key]}' already exists in '${key}'`)
        return res.status(500).json({message})
    }

    return res.status(500).json({message: 'Internal server error', error: err})
}

export default errorHandler
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import 'express-async-errors'
import path from 'path'
import dotenv from 'dotenv'

import routes from './routes'
import errorHandler from './errors/handler'

const app = express()
dotenv.config()

app.use(cors())
app.use(express.json())

mongoose.connect(
    'mongodb://localhost/stemguy',
    {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true}
)
mongoose.connection
.once('open', () => console.log('database connected'))
.on('error', error => console.log('[database connection error]:', error))

app.use(routes)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))
app.use(errorHandler)

const port = 4755
app.listen(port, () => console.log('server started at port', port))
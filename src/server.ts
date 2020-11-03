import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import 'express-async-errors'

import routes from './routes'
import errorHandler from './errors/handler'

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost/stemguy', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
mongoose.connection
.once('open', () => console.log('database connected'))
.on('error', error => console.log('[database connection error]:', error))

app.use(routes)
app.use(errorHandler)

const port = 4755
app.listen(port, () => console.log('server started at port', port))
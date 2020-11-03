import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import routes from './routes'

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost/stemguy', {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connection
.once('open', () => console.log('database connected'))
.on('error', error => console.log('[database connection error]:', error))

app.use(routes)

app.listen(3333, () => console.log('server started'))
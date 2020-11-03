import express from 'express'

import Post from './controllers/Post'

const routes = express.Router()

routes.post('/posts', Post.create)

export default routes
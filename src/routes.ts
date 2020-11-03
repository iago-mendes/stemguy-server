import express from 'express'

import Post from './controllers/Post'

const routes = express.Router()

routes.post('/posts', Post.create)
routes.put('/posts/:id', Post.update)
routes.get('/posts', Post.list)

export default routes
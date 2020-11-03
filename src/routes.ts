import express from 'express'

import Post from './controllers/Post'

const routes = express.Router()

routes.post('/posts', Post.create)
routes.put('/posts/:id', Post.update)
routes.delete('/posts/:id', Post.remove)
routes.get('/posts', Post.list)
routes.get('/posts/:id', Post.show)

export default routes
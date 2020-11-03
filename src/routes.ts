import express from 'express'

import Post from './controllers/Post'
import Flag from './controllers/Flag'

const routes = express.Router()

routes.post('/posts', Post.create)
routes.put('/posts/:id', Post.update)
routes.delete('/posts/:id', Post.remove)
routes.get('/posts', Post.list)
routes.get('/posts/:id', Post.show)

routes.post('/flags', Flag.create)
routes.put('/flags/:id', Flag.update)
routes.delete('/flags/:id', Flag.remove)
routes.get('/flags', Flag.list)

export default routes
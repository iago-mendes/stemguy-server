import express from 'express'

import Post from './controllers/Post'
import Flag from './controllers/Flag'
import Author from './controllers/Author'
import Image from './controllers/Image'

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

routes.post('/authors', Author.create)
routes.put('/authors/:id', Author.update)
routes.delete('/authors/:id', Author.remove)
routes.get('/authors', Author.list)

routes.post('/images', Image.create)
routes.put('/images/:id', Image.update)
routes.delete('/images/:id', Image.remove)
routes.get('/images', Image.list)

export default routes
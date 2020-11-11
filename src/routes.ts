import express from 'express'
import multer from 'multer'

import multerConfig from './config/multer'
import Post from './controllers/Post'
import Flag from './controllers/Flag'
import Author from './controllers/Author'
import Image from './controllers/Image'

const routes = express.Router()
const upload = multer(multerConfig)

routes.post('/posts', Post.create)
routes.put('/posts/:id', Post.update)
routes.delete('/posts/:id', Post.remove)
routes.get('/posts', Post.list)
routes.get('/posts/:urlId', Post.show)
routes.get('/posts-raw', Post.raw)
routes.get('/posts-raw/:urlId', Post.rawOne)

routes.post('/flags', Flag.create)
routes.put('/flags/:id', Flag.update)
routes.delete('/flags/:id', Flag.remove)
routes.get('/flags', Flag.list)

routes.post('/authors', upload.single('image'), Author.create)
routes.put('/authors/:id', upload.single('image'), Author.update)
routes.delete('/authors/:id', Author.remove)
routes.get('/authors', Author.list)

routes.post('/images', upload.single('image'), Image.create)
routes.put('/images/:id', upload.single('image'), Image.update)
routes.delete('/images/:id', Image.remove)
routes.get('/images', Image.list)

export default routes
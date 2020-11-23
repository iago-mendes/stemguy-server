import express from 'express'
import multer from 'multer'

import multerConfig from './config/multer'
import Post from './controllers/Post'
import Flag from './controllers/Flag'
import Author from './controllers/Author'
import Image from './controllers/Image'
import checkKey from './middleware/checkKey'

const routes = express.Router()
const upload = multer(multerConfig)

routes.post('/posts', checkKey, Post.create)
routes.put('/posts/:id', checkKey, Post.update)
routes.delete('/posts/:id', checkKey, Post.remove)
routes.get('/posts', Post.list)
routes.get('/posts/:urlId', Post.show)
routes.get('/posts-raw', checkKey, Post.raw)
routes.get('/posts-raw/:urlId', checkKey, Post.rawOne)

routes.post('/flags', checkKey, Flag.create)
routes.put('/flags/:id', checkKey, Flag.update)
routes.delete('/flags/:id', checkKey, Flag.remove)
routes.get('/flags', Flag.list)

routes.post('/authors', [checkKey, upload.single('image')], Author.create)
routes.put('/authors/:id', [checkKey, upload.single('image')], Author.update)
routes.delete('/authors/:id', checkKey, Author.remove)
routes.get('/authors', Author.list)

routes.post('/images', [checkKey, upload.single('image')], Image.create)
routes.put('/images/:id', [checkKey, upload.single('image')], Image.update)
routes.delete('/images/:id', checkKey, Image.remove)
routes.get('/images', Image.list)

export default routes
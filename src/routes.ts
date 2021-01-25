import express from 'express'
import multer from 'multer'

import multerConfig from './config/multer'
import Post from './controllers/Post'
import Flag from './controllers/Flag'
import Member from './controllers/Member'
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

routes.post('/members', [checkKey, upload.single('image')], Member.create)
routes.put('/members/:id', [checkKey, upload.single('image')], Member.update)
routes.delete('/members/:id', checkKey, Member.remove)
routes.get('/members', Member.list)
routes.get('/members/:id', checkKey, Member.show)

routes.post('/images', [checkKey, upload.single('image')], Image.create)
routes.put('/images/:id', [checkKey, upload.single('image')], Image.update)
routes.delete('/images/:id', checkKey, Image.remove)
routes.get('/images', Image.list)
routes.get('/images/:id', Image.show)
routes.get('/images-raw', Image.raw)

export default routes
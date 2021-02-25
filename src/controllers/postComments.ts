import {Request, Response} from 'express'

import Post from '../models/Post'

const postComments =
{
	create: async (req: Request, res: Response) =>
	{
		const {urlId} = req.params
		const {userEmail, text} = req.body

		if (!userEmail || !text)
			return res.status(400).json({message: 'You need to provide a user email and a text!'})

		const post = await Post.findOne({url_id: urlId})
		if (!post)
			return res.status(404).json({message: 'Post not found!'})

		const comment = {userEmail, text, replies: []}
		let comments = post.comments ? post.comments : []
		comments.push(comment)

		await Post.updateOne({url_id: urlId}, {comments})
		return res.send()
	}
}

export default postComments
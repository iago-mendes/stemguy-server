import {Request, Response} from 'express'

import Post from '../models/Post'
import User from '../models/User'
import formatImage from '../utils/formatImage'

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
	},

	remove: async (req: Request, res: Response) =>
	{
		const {urlId, commentId} = req.params

		const post = await Post.findOne({url_id: urlId})
		if (!post)
			return res.status(404).json({message: 'Post not found!'})

		let comments = post.comments
		if (!comments)
			return res.status(404).json({message: 'No comments were found!'})
		
		comments = comments.filter(({_id}) => String(_id) != String(commentId))

		await Post.updateOne({url_id: urlId}, {comments})
		return res.send()
	},

	reply: async (req: Request, res: Response) =>
	{
		const {urlId, commentId} = req.params
		const {userEmail, text, isMember} = req.body

		if (!userEmail || !text || !isMember)
			return res.status(400).json({message: 'You need to provide more information!'})

		const post = await Post.findOne({url_id: urlId})
		if (!post)
			return res.status(404).json({message: 'Post not found!'})

		let comments = post.comments
		if (!comments)
			return res.status(404).json({message: 'No comments were found!'})

		const commentIndex = comments.findIndex(({_id}) => String(_id) == String(commentId))
		if (commentIndex < 0)
			return res.status(404).json({message: 'Comment not found!'})

		const reply = {userEmail, text, isMember}
		comments[commentIndex].replies.push(reply)

		await Post.updateOne({url_id: urlId}, {comments})
		return res.send()
	},

	removeReply: async (req: Request, res: Response) =>
	{
		const {urlId, commentId, replyId} = req.params

		const post = await Post.findOne({url_id: urlId})
		if (!post)
			return res.status(404).json({message: 'Post not found!'})

		let comments = post.comments
		if (!comments)
			return res.status(404).json({message: 'No comments were found!'})
		
		const commentIndex = comments.findIndex(({_id}) => String(_id) != String(commentId))
		if (commentIndex < 0)
			return res.status(404).json({message: 'Comment not found!'})

		const replies = comments[commentIndex].replies.filter(({_id}) => String(_id) != String(replyId))
		comments[commentIndex].replies = replies

		await Post.updateOne({url_id: urlId}, {comments})
		return res.send()
	},

	list: async (req: Request, res: Response) =>
	{
		const {urlId} = req.params

		const post = await Post.findOne({url_id: urlId})
		if (!post)
			return res.status(404).json({message: 'Post not found!'})

		let list:
		{
			id: string
			user:
			{
				email: string
				name: string
				image: string
			}
			text: string
			replies: Array<
			{
				id: string
				user:
				{
					email: string
					name: string
					image: string
				}
				text: string
				isMember: boolean
			}>
		}[] = []

		const comments = post.comments || []
		const promise = comments.map(async (comment) =>
		{
			let userInfo =
			{
				image: formatImage(undefined),
				name: 'Unknown name',
				email: ''
			}

			const user = await User.findOne({email: comment.userEmail})
			if (user)
			{
				userInfo.email = user.email
				if (user.name)
					userInfo.name = user.name
				if (user.image)
					userInfo.image = user.image
			}

			let replies:
			{
				id: string
				user:
				{
					email: string
					name: string
					image: string
				}
				text: string
				isMember: boolean
			}[] = []

			const promise2 = comment.replies.map(async reply =>
			{
				let userInfo =
				{
					image: formatImage(undefined),
					name: 'Unknown name',
					email: ''
				}

				const user = await User.findOne({email: comment.userEmail})
				if (user)
				{
					userInfo.email = user.email
					if (user.name)
						userInfo.name = user.name
					if (user.image)
						userInfo.image = user.image
				}

				replies.push(
				{
					id: String(reply._id),
					user: userInfo,
					text: reply.text,
					isMember: reply.isMember
				})
			})
			await Promise.all(promise2)

			list.push(
			{
				id: String(comment._id),
				user: userInfo,
				text: comment.text,
				replies
			})
		})
		await Promise.all(promise)

		return res.json(list)
	}
}

export default postComments
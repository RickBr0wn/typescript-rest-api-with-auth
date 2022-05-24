import { Request, Response } from 'express'
import User from '../models/user'

const server = (req: Request, res: Response): Response => {
	return res.status(200).json({ message: 'finally!!' })
}

const database = async (req: Request, res: Response): Promise<Response> => {
	const randomUser = new User({
		email: 'bbb@bbb.com',
		password: 'stupid_password'
	})

	await randomUser.save()

	return res.status(200).json({ message: 'random user created.' })
}

export default { server, database }

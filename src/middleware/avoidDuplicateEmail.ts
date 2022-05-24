import { NextFunction, Request, Response } from 'express'
import { _RequestBody } from '../index.d'
import User from '../models/user'

export default async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	const { email }: _RequestBody = req.body

	const existingUser = await User.findOne({ email })

	if (existingUser) {
		return res
			.status(403)
			.json({ message: 'user already exists in the database.' })
	}

	next()
}

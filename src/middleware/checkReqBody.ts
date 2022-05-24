import { NextFunction, Request, Response } from 'express'
import { _RequestBody } from '../index.d'

export default async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	const { email, password }: _RequestBody = req.body

	if (!email || !password) {
		return res.status(403).json({
			message: 'email and password must be provided in the request body.'
		})
	}

	next()
}

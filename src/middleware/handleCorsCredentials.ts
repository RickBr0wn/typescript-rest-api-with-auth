import { Request, Response, NextFunction } from 'express'
import allowedOrigins from '../allowedOrigins'

export default (req: Request, res: Response, next: NextFunction) => {
	const origin = req.headers.origin

	if (allowedOrigins.includes[origin]) {
		res.header('Access-Control-Allow-Credentials', 'true')
	}

	next()
}

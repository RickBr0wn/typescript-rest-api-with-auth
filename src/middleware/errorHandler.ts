import { NextFunction, Request, Response } from 'express'
import { logEvents } from './logger'

export default (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	logEvents(`${err.name}: ${err.message}`, 'errorLog.txt')
	console.log(err.stack)

	res.status(500).send(err.message)

	next()
}

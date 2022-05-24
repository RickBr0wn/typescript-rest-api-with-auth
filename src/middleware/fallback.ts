import { Request, Response } from 'express'
import * as path from 'path'

export default (req: Request, res: Response) => {
	res.status(404)
	// if (req.accepts('html')) {
	// 	res.sendFile(path.join(__dirname, 'views', '404.html'))
	// } else if (req.accepts('json')) {
	if (req.accepts('json')) {
		res.json({
			status: 404,
			message: '404 - Page Not Found'
		})
	} else {
		res.type('txt').send('404 - Page Not Found')
	}
}

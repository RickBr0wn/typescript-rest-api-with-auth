import { Request, Response, NextFunction } from 'express'
import { format } from 'date-fns'
import * as fs from 'fs'
import * as path from 'path'
import { v4 } from 'uuid'

const fsPromises = fs.promises

const logEvents = async (message: string, logName: string): Promise<void> => {
	const dateAndTime = `${format(new Date(), 'dd-MM-yyyy\tHH:mm:ss')}`
	const logItem = `${dateAndTime}\t${v4()}\t${message}\n`

	try {
		if (!fs.existsSync(path.join(__dirname, '../', '../', 'logs'))) {
			await fsPromises.mkdir(path.join(__dirname, '../', '../', 'logs'))
		}

		await fsPromises.appendFile(
			path.join(__dirname, '../', '../', 'logs', logName),
			logItem
		)
	} catch (error) {}
}

const logger = (req: Request, res: Response, next: NextFunction): void => {
	const origin = req.headers.origin || ''
	logEvents(`${req.method}\t${origin}\t${req.url}`, 'reqLog.txt')
	next()
}

export { logEvents, logger }

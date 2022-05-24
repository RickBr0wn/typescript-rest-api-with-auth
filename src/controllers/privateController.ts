import { Request, Response } from 'express'

const sensitive = async (req: Request, res: Response): Promise<Response> => {
	return res.status(200).json({ message: 'sensitive data.' })
}

export default { sensitive }

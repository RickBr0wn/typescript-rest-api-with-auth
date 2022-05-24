import { _DecodedFromEmail } from './../index.d'
import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import User from '../models/user'

const refreshToken = async (req: Request, res: Response): Promise<Response> => {
	const cookies = req.cookies

	if (!cookies?.jwt) {
		return res.status(401).json({ message: 'no jwt cookie found.' })
	}

	const refreshToken = cookies.jwt

	const user = await User.findOne({ token: refreshToken })

	if (!user) {
		return res
			.status(403)
			.json({ message: 'forbidden, no refresh token found in database' })
	}

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		(err: Error, decoded: _DecodedFromEmail) => {
			if (err || user.email !== decoded.email) {
				return res.status(403).json({ message: 'error verifying token.' })
			}

			const accessToken = jwt.sign(
				{ email: decoded.email },
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: '30s' }
			)

			return res.status(200).json({ accessToken })
		}
	)
}

export default { refreshToken }

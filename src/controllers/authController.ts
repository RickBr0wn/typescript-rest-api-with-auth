import { _RequestBody, _User } from './../index.d'
import { Request, Response } from 'express'
import User from '../models/user'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

const register = async (req: Request, res: Response): Promise<Response> => {
	const { email, password }: _RequestBody = req.body

	const newUser = new User({
		email,
		password
	})

	await newUser.save()

	return res.status(200).json({
		message: `new user with the email ${email} has been created in database.`
	})
}

const login = async (req: Request, res: Response): Promise<Response> => {
	const { email, password }: _RequestBody = req.body

	const existingUser = await User.findOne({ email })

	if (!existingUser) {
		return res
			.status(403)
			.json({ message: 'user does not exist in the database.' })
	}

	const isMatch = await bcrypt.compare(password, existingUser.password)

	if (isMatch) {
		const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: '5m'
		})

		const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
			expiresIn: '1d'
		})

		const updateResult = await User.updateOne(
			{ _id: existingUser._id },
			{ $set: { token: refreshToken } }
		)

		if (!updateResult) {
			return res
				.status(401)
				.json({ message: 'an error occured whilst saving to the database.' })
		}

		res.cookie('jwt', refreshToken, {
			httpOnly: true,
			sameSite: true,
			secure: true,
			maxAge: 24 * 60 * 60 * 1000 // 1 day
		})

		return res.status(200).json({
			loggedIn: true,
			message: `${email} successfully logged in.`,
			token: accessToken
		})
	}

	return res.status(200).json({
		loggedIn: true,
		message: `incorrect credentials.`
	})
}

const logout = async (req: Request, res: Response): Promise<Response> => {
	// at this point the client also needs to delete the access token.
	const cookies = req.cookies

	if (!cookies) {
		return res.status(204).json({ message: 'no cookies' })
	}

	const refreshToken = cookies.jwt

	const user = await User.findOne({
		token: refreshToken
	})

	if (!user) {
		// here we have an refresh token (in cookie) but no access token.
		// so delete the cookie.
		// add `secure: true` to the object when in development.
		res.clearCookie('jwt', {
			httpOnly: true,
			sameSite: true,
			secure: true
		})

		return res.status(204).json({
			message:
				'no refresh token found in database, but the cookie has been deleted.'
		})
	}

	// access token and refresh token (in cookie) found.
	await user.update({ token: '' })

	await user.save()

	// add `secure: true` to the object when in development.
	res.clearCookie('jwt', {
		httpOnly: true,
		sameSite: true,
		secure: true
	})

	return res
		.status(200)
		.json({ message: `${user.email} has successfully logged out` })
}

export default { login, register, logout }

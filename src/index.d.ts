import { Document } from 'mongoose'

export interface _User extends Document {
	email: string
	password: string
	createdAt: string
	updatedAt: string
	token: string
}

export interface _RequestBody {
	email: string
	password: string
}

export type _CorsOptionsOriginCallback = (
	error: Error | null,
	isOnTheWhitelist: boolean | null
) => void

export interface _DecodedFromEmail {
	email: string
	iat: number
	exp: number
}

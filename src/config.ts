import * as dotenv from 'dotenv'
dotenv.config()

const SERVER_PORT = process.env.PORT || 5000

const MONGO_URL = 'mongodb://127.0.0.1:27017/typescript-sandbox'

const MONGO_OPTIONS = {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	socketTimeoutMS: 30000,
	keepAlive: true,
	autoIndex: false,
	retryWrites: false,
	bufferCommands: false
}

const SERVER = {
	port: SERVER_PORT
}

const MONGO = {
	options: MONGO_OPTIONS,
	url: MONGO_URL
}

export default { mongo: MONGO, server: SERVER }

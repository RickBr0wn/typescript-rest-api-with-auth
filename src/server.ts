import { _CorsOptionsOriginCallback } from './index.d'
import * as express from 'express'
import type { Request, Response } from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import { logger } from './middleware/logger'
import healthRoutes from './routes/healthRoutes'
import * as mongoose from 'mongoose'
import config from './config'
import authRoutes from './routes/authRoutes'
import errorHandler from './middleware/errorHandler'
import fallback from './middleware/fallback'
import privateRoutes from './routes/privateRoutes'
import * as cookieParser from 'cookie-parser'
import refreshTokenRoutes from './routes/refreshTokenRoutes'
import allowedOrigins from './allowedOrigins'
import handleCorsCredentials from './middleware/handleCorsCredentials'

const port: string | number = process.env.PORT || 5000

const app = express()

let connections = []

if (!config.mongo.url) {
	throw new Error('Please define the MONGODB_URL in the config file.')
}

let cached = global.mongoose

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
	if (cached.conn) {
		return cached.conn
	}

	if (!cached.promise) {
		cached.promise = mongoose
			.connect(config.mongo.url, config.mongo.options)
			.then(mongoose => mongoose)
	}

	cached.conn = await cached.promise

	return cached.conn
}

dbConnect()
	.then(() => console.log(`Connected to database ${config.mongo.url}`))
	.catch(error =>
		console.log(
			`There was an error connecting to the database ${config.mongo.url}: ${error}`
		)
	)

app.use(handleCorsCredentials)

const corsOptions = {
	origin: (origin: string, callback: _CorsOptionsOriginCallback) => {
		if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS.'), null)
		}
	},
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

/** parse the request */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cookieParser())

app.use(logger)

app.use('/auth/', authRoutes)
app.use('/health-check', healthRoutes)
app.use('/api/private', privateRoutes)
app.use('/api/refresh', refreshTokenRoutes)

/** fallback handler */
app.all('*', fallback)
/** error handler */
app.use(errorHandler)

const server = app.listen(port, (): void => {
	console.log(`Server is listening on port ${port}.`)
})

server.on('connection', connection => {
	connections.push(connection)
	connection.on(
		'close',
		() => (connections = connections.filter(curr => curr !== connection))
	)
})

process.on('SIGTERM', shutDown)
process.on('SIGINT', shutDown)

function shutDown() {
	console.log('Received kill signal, shutting down gracefully')
	server.close(() => {
		console.log('Closed out remaining connections')
		process.exit(0)
	})

	setTimeout(() => {
		console.error(
			'Could not close connections in time, forcefully shutting down'
		)
		process.exit(1)
	}, 10000)

	connections.forEach(curr => curr.end())
	setTimeout(() => connections.forEach(curr => curr.destroy()), 5000)
}

import mongoose from 'mongoose'
import type { H3Event } from 'h3'

export async function ensureMongoConnection(event: H3Event) {
	const config = useRuntimeConfig(event)
	const uri = config.mongoUri

	if (!uri) {
		throw createError({ statusCode: 500, statusMessage: 'MONGODB_URI non configurata' })
	}

	if (mongoose.connection.readyState === 1) return mongoose

	if (mongoose.connection.readyState === 2) {
		await mongoose.connection.asPromise()
		return mongoose
	}

	await mongoose.connect(uri, {
		dbName: config.mongoDbName || undefined,
		serverSelectionTimeoutMS: 5000,
	})

	return mongoose
}

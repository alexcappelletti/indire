import { GridFSBucket } from 'mongodb';
import type { H3Event } from 'h3';
import { ensureMongoConnection } from './mongoClient';

export const DEFAULT_GRIDFS_BUCKET = 'resources';

export async function getGridFsBucket(event: H3Event) {
	const mongoose = await ensureMongoConnection(event);
	const db = mongoose.connection.db;
	if (!db) {
		throw createError({ statusCode: 503, statusMessage: 'Database MongoDB non disponibile' });
	}

	const config = useRuntimeConfig(event);
	return new GridFSBucket(db, {
		bucketName: config.gridFsBucketName || DEFAULT_GRIDFS_BUCKET,
	});
}

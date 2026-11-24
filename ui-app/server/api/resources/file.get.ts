import { getQuery, sendStream, setHeader } from 'h3';
import { ResourceModel } from '../../models/resource';
import { ensureMongoConnection } from '../../utils/mongoClient';
import { getGridFsBucket } from '../../utils/gridfs';
import { readSession } from '../../utils/auth-session';

export default defineEventHandler(async (event) => {
	if (!readSession(event)) {
		throw createError({ statusCode: 401, statusMessage: 'Autenticazione richiesta' });
	}

	const query = getQuery(event);
	const filename = typeof query.filename === 'string' ? query.filename.trim() : '';
	if (!filename) {
		throw createError({ statusCode: 400, statusMessage: 'Nome file mancante' });
	}

	await ensureMongoConnection(event);
	const resource = await ResourceModel.findOne({
		filename,
		isPublished: true,
	}).lean();

	if (!resource) {
		throw createError({ statusCode: 404, statusMessage: 'Risorsa non trovata' });
	}

	const bucket = await getGridFsBucket(event);
	const safeFilename = encodeURIComponent(resource.filename);
	setHeader(event, 'Content-Type', resource.mimeType);
	setHeader(event, 'Content-Length', String(resource.sizeBytes));
	setHeader(
		event,
		'Content-Disposition',
		`inline; filename*=UTF-8''${safeFilename}`,
	);

	return sendStream(event, bucket.openDownloadStream(resource.gridFsFileId));
});

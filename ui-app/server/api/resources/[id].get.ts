import { ObjectId } from 'mongodb';
import { getRouterParam, sendStream, setHeader } from 'h3';
import { ResourceModel } from '../../models/resource';
import { ensureMongoConnection } from '../../utils/mongoClient';
import { getGridFsBucket } from '../../utils/gridfs';

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, 'id');
	if (!id || !ObjectId.isValid(id)) {
		throw createError({ statusCode: 400, statusMessage: 'Identificativo risorsa non valido' });
	}

	await ensureMongoConnection(event);
	const resource = await ResourceModel.findOne({ _id: id, isPublished: true }).lean();
	if (!resource) {
		throw createError({ statusCode: 404, statusMessage: 'Risorsa non trovata' });
	}

	const bucket = await getGridFsBucket(event);
	setHeader(event, 'Content-Type', resource.mimeType);
	setHeader(event, 'Content-Length', String(resource.sizeBytes));
	setHeader(event, 'Content-Disposition', `inline; filename="${resource.filename}"`);

	return sendStream(event, bucket.openDownloadStream(resource.gridFsFileId));
});

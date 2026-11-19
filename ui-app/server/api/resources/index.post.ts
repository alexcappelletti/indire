import { readMultipartFormData } from 'h3';
import { readSession } from '../../utils/auth-session';
import { uploadPdfResource } from '../../services/resourceUpload';
import { enforceRateLimit } from '../../utils/rateLimit';

const MAX_PDF_SIZE = 50 * 1024 * 1024;

export default defineEventHandler(async (event) => {
	const session = readSession(event);
	if (!session) {
		throw createError({ statusCode: 401, statusMessage: 'Autenticazione richiesta' });
	}
	enforceRateLimit(event, `resource-upload:${session.sub}`, 5, 10 * 60_000);

	const parts = await readMultipartFormData(event);
	const filePart = parts?.find((part) => part.name === 'file');
	const titlePart = parts?.find((part) => part.name === 'title');
	const authorPart = parts?.find((part) => part.name === 'author');
	const folderPart = parts?.find((part) => part.name === 'folderPath');

	if (!filePart?.data || !filePart.filename) {
		throw createError({ statusCode: 400, statusMessage: 'File PDF mancante' });
	}
	if (filePart.type !== 'application/pdf') {
		throw createError({ statusCode: 415, statusMessage: 'Sono consentiti solo file PDF' });
	}
	if (filePart.data.length > MAX_PDF_SIZE) {
		throw createError({ statusCode: 413, statusMessage: 'Il PDF supera il limite di 50 MB' });
	}

	const title = titlePart?.data.toString('utf8').trim();
	const author = authorPart?.data.toString('utf8').trim();
	const folderPath = folderPart?.data.toString('utf8').trim() || 'pdf';
	if (!title || !author) {
		throw createError({ statusCode: 400, statusMessage: 'Titolo e autore sono obbligatori' });
	}

	return uploadPdfResource(event, {
		buffer: filePart.data,
		filename: filePart.filename,
		title,
		author,
		folderPath,
	});
});

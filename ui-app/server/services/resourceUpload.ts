import type { H3Event } from 'h3';
import { ResourceModel } from '../models/resource';
import { getGridFsBucket } from '../utils/gridfs';
import { toResourceDto } from '../utils/resourceDto';

export type PdfResourceUpload = {
	buffer: Buffer;
	filename: string;
	title: string;
	author: string;
	folderPath?: string;
};

function sanitizeSegment(value: string) {
	return value
		.trim()
		.replace(/[^a-zA-Z0-9._-]/g, '-')
		.replace(/-+/g, '-')
		.replace(/^[-.]+|[-.]+$/g, '');
}

function getResourcePath(folderPath: string | undefined, filename: string) {
	const safeFilename = sanitizeSegment(filename);
	const safeFolderPath = (folderPath || 'pdf')
		.split('/')
		.map(sanitizeSegment)
		.filter(Boolean)
		.join('/');

	if (!safeFilename.toLowerCase().endsWith('.pdf')) {
		throw createError({ statusCode: 415, statusMessage: 'Sono consentiti solo file PDF' });
	}

	return `${safeFolderPath || 'pdf'}/${safeFilename}`;
}

export async function uploadPdfResource(
	event: H3Event,
	input: PdfResourceUpload,
) {
	if (!input.buffer.length) {
		throw createError({ statusCode: 400, statusMessage: 'Il file PDF è vuoto' });
	}

	if (input.buffer.subarray(0, 5).toString('ascii') !== '%PDF-') {
		throw createError({ statusCode: 415, statusMessage: 'Il file non è un PDF valido' });
	}

	const title = input.title.trim();
	const author = input.author.trim();
	if (!title || !author) {
		throw createError({ statusCode: 400, statusMessage: 'Titolo e autore sono obbligatori' });
	}

	const folderPath = input.folderPath?.trim() || 'pdf';
	const filename = getResourcePath(folderPath, input.filename);
	const bucket = await getGridFsBucket(event);
	const uploadStream = bucket.openUploadStream(filename, {
		contentType: 'application/pdf',
		metadata: { title, author, folderPath },
	});

	try {
		await new Promise<void>((resolve, reject) => {
			uploadStream.once('finish', resolve);
			uploadStream.once('error', reject);
			uploadStream.end(input.buffer);
		});

		const resource = await ResourceModel.create({
			title,
			author,
			kind: 'pdf',
			filename: input.filename,
			folderPath,
			mimeType: 'application/pdf',
			sizeBytes: input.buffer.length,
			gridFsFileId: uploadStream.id,
			isPublished: false,
		});

		return toResourceDto(resource.toObject());
	} catch (error) {
		try {
			await bucket.delete(uploadStream.id);
		} catch {
			// Il file verrà eventualmente rimosso da una procedura di pulizia.
		}
		throw error;
	}
}

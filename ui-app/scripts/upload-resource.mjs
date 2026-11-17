import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { GridFSBucket, MongoClient } from 'mongodb';

const MAX_PDF_SIZE = 50 * 1024 * 1024;

function readOption(args, name) {
	const index = args.indexOf(name);
	return index >= 0 ? args[index + 1] : undefined;
}

function sanitizeSegment(value) {
	return value
		.trim()
		.replace(/[^a-zA-Z0-9._-]/g, '-')
		.replace(/-+/g, '-')
		.replace(/^[-.]+|[-.]+$/g, '');
}

function titleFromFilename(filename) {
	return path.basename(filename, path.extname(filename)).replace(/[-_]+/g, ' ').trim();
}

function usage() {
	console.error(`Uso cartella:
  npm run resource:upload -- --folder <cartella> --author <autore> [--target <cartella-gridfs>]

Uso singolo file:
  npm run resource:upload -- --file <percorso.pdf> --title <titolo> --author <autore> [--target <cartella-gridfs>]

Esempio:
  npm run resource:upload -- --folder .data/resources --author "C. Caruso" --target pdf`);
}

async function collectPdfFiles(folderPath) {
	const entries = await readdir(folderPath, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const entryPath = path.join(folderPath, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await collectPdfFiles(entryPath)));
		} else if (entry.isFile() && entry.name.toLowerCase().endsWith('.pdf')) {
			files.push(entryPath);
		}
	}

	return files;
}

async function uploadPdf({ bucket, db, filePath, relativePath, author, targetFolder, title }) {
	const buffer = await readFile(filePath);
	if (!buffer.length) throw new Error('file vuoto');
	if (buffer.length > MAX_PDF_SIZE) throw new Error('supera il limite di 50 MB');
	if (buffer.subarray(0, 5).toString('ascii') !== '%PDF-') {
		throw new Error('non è un PDF valido');
	}

	const relativeDirectory = path.dirname(relativePath);
	const folderSegments = [
		targetFolder,
		relativeDirectory === '.' ? '' : relativeDirectory,
	]
		.flatMap((value) => value.split(/[\\/]/))
		.map(sanitizeSegment)
		.filter(Boolean);
	const folderPath = folderSegments.join('/') || 'pdf';
	const safeFilename = sanitizeSegment(path.basename(filePath));
	const gridFsFilename = `${folderPath}/${safeFilename}`;
	const uploadStream = bucket.openUploadStream(gridFsFilename, {
		contentType: 'application/pdf',
		metadata: { title, author, folderPath },
	});

	await new Promise((resolve, reject) => {
		uploadStream.once('finish', resolve);
		uploadStream.once('error', reject);
		uploadStream.end(buffer);
	});

	try {
		const now = new Date();
		await db.collection('resources').insertOne({
			title,
			author,
			kind: 'pdf',
			filename: path.basename(filePath),
			folderPath,
			mimeType: 'application/pdf',
			sizeBytes: buffer.length,
			gridFsFileId: uploadStream.id,
			relevance: 0,
			isPublished: false,
			createdAt: now,
			updatedAt: now,
		});
	} catch (error) {
		await bucket.delete(uploadStream.id).catch(() => undefined);
		throw error;
	}

	return { gridFsFilename, sizeBytes: buffer.length };
}

const args = process.argv.slice(2);
const filePath = readOption(args, '--file');
const folderPath = readOption(args, '--folder');
const singleTitle = readOption(args, '--title');
const author = readOption(args, '--author') || 'Import locale';
const targetFolder = readOption(args, '--target') || 'pdf';

if ((!filePath && !folderPath) || (filePath && folderPath)) {
	usage();
	process.exitCode = 1;
	process.exit();
}

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;
const bucketName = process.env.GRIDFS_BUCKET_NAME || 'resources';
if (!mongoUri || !dbName) {
	throw new Error('Configura MONGODB_URI e MONGODB_DB_NAME nel file .env');
}

const inputFolder = folderPath ? path.resolve(folderPath) : undefined;
const files = filePath
	? [path.resolve(filePath)]
	: await collectPdfFiles(inputFolder);

if (!files.length) {
	throw new Error('Nessun file PDF trovato');
}

const client = new MongoClient(mongoUri);
let uploaded = 0;
let failed = 0;

try {
	await client.connect();
	const db = client.db(dbName);
	const bucket = new GridFSBucket(db, { bucketName });

	for (const currentFile of files) {
		try {
			const relativePath = inputFolder
				? path.relative(inputFolder, currentFile)
				: path.basename(currentFile);
			const result = await uploadPdf({
				bucket,
				db,
				filePath: currentFile,
				relativePath,
				author,
				targetFolder,
				title: singleTitle || titleFromFilename(currentFile),
			});
			uploaded += 1;
			console.log(`OK ${relativePath} -> ${result.gridFsFilename}`);
		} catch (error) {
			failed += 1;
			console.error(`ERRORE ${currentFile}: ${error instanceof Error ? error.message : error}`);
		}
	}
} finally {
	await client.close();
}

console.log(`Import completato: ${uploaded} caricati, ${failed} falliti`);
if (failed > 0) process.exitCode = 1;

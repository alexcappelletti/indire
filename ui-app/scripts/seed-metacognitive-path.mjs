import mongoose from 'mongoose';
import { metacognitivePathMock } from '../shared/mocks/learningMock.ts';
import { AuthorizedUserModel } from '../server/models/authorizedUser.ts';
import { UserMetacognitivePathModel } from '../server/models/userMetacognitivePath.ts';
import { METACOGNITIVE_PATH_SEED_VERSION } from '../shared/constants/metacognition.ts';

function readArgument(name) {
	const index = process.argv.indexOf(name);
	return index >= 0 ? process.argv[index + 1] : undefined;
}

if (process.argv.includes('--help')) {
	console.log(
		'Usage: npm run db:seed:path -- --email <utente@email.it>\n' +
		'       npm run db:seed:path -- --email <utente@email.it> --force\n\n' +
		'--email    Email dell\'utente autorizzato\n' +
		'--force    Sovrascrive il percorso esistente con il mock aggiornato',
	);
	process.exit(0);
}

const email = (readArgument('--email') || process.env.SEED_USER_EMAIL || '')
	.trim()
	.toLowerCase();
const force = process.argv.includes('--force');
const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

if (!mongoUri || !dbName) {
	throw new Error('Configura MONGODB_URI e MONGODB_DB_NAME nel file .env');
}

if (!email) {
	throw new Error(
		'Indica l\'utente con --email <email> oppure imposta SEED_USER_EMAIL.',
	);
}

try {
	await mongoose.connect(mongoUri, {
		dbName,
		serverSelectionTimeoutMS: 10_000,
	});

	const authorizedUser = await AuthorizedUserModel.findOne({
		email,
		isActive: true,
	}).lean();

	if (!authorizedUser) {
		throw new Error(`Nessun utente autorizzato trovato per ${email}.`);
	}

	const userId = String(authorizedUser._id);
	const path = structuredClone(metacognitivePathMock);
	const existing =
		(await UserMetacognitivePathModel.findOne({ userId }).lean()) ||
		(await UserMetacognitivePathModel.findOne({ userId: email }).lean());

	if (existing) {
		const result = await UserMetacognitivePathModel.updateOne(
			{ _id: existing._id },
			{
				$set: {
					userId,
					...(force
						? {
							path,
							seedVersion: METACOGNITIVE_PATH_SEED_VERSION,
						}
						: {}),
				},
			},
		);

		console.log(
			force
				? `Percorso ricreato per ${email} (${userId}).`
				: result.modifiedCount
					? `Identificativo aggiornato per ${email}: ${userId}.`
					: `Percorso già presente per ${email}; usa --force per ricrearlo.`,
		);
	} else {
		await UserMetacognitivePathModel.create({
			userId,
			seedVersion: METACOGNITIVE_PATH_SEED_VERSION,
			path,
		});
		console.log(`Percorso creato per ${email} (${userId}).`);
	}
} finally {
	await mongoose.disconnect();
}

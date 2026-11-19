import { ensureMongoConnection } from '../utils/mongoClient';

export default defineEventHandler(async (event) => {
	let redisOk = false;
	let redisMessage = '';
	let mongoOk = false;
	let mongoConnected = false;
	let mongoExists = false;
	let mongoMessage = '';
	let mongoDbName = '';

	try {
		const mongoose = await ensureMongoConnection(event);
		mongoConnected = mongoose.connection.readyState === 1;
		mongoDbName = String(mongoose.connection.db?.databaseName || '');

		if (mongoConnected && mongoose.connection.db) {
			const admin = mongoose.connection.db.admin();
			const databases = await admin.listDatabases();
			const dbList = Array.isArray(databases?.databases) ? databases.databases : [];
			mongoExists = dbList.some((db) => db?.name === mongoDbName);
			mongoOk = mongoConnected && mongoExists;
			mongoMessage = mongoOk
				? 'MongoDB reachable and database found'
				: 'MongoDB connected but database not found';
		} else {
			mongoMessage = 'MongoDB not connected';
		}
	} catch (error: any) {
		mongoMessage = error?.statusMessage || error?.message || 'MongoDB unreachable';
	}

	return { ok: mongoOk };
	/*
	return {
		// Redis non è ancora configurato: il servizio HTTP può comunque essere attivo.
		ok: mongoOk,
		service: 'indire',
		timestamp: new Date().toISOString(),
		redis: { ok: redisOk, message: redisMessage },
		mongodb: {
			ok: mongoOk,
			connected: mongoConnected,
			dbName: mongoDbName,
			exists: mongoExists,
			message: mongoMessage,
		},
	};
	*/
});

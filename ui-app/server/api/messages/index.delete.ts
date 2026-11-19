import { readSession } from '../../utils/auth-session';
import { ensureMongoConnection } from '../../utils/mongoClient';
import { AgentConversationModel } from '../../models/agentConversation';

export default defineEventHandler(async (event) => {
	const session = readSession(event);
	if (!session) {
		throw createError({ statusCode: 401, statusMessage: 'Autenticazione richiesta' });
	}

	await ensureMongoConnection(event);
	await AgentConversationModel.deleteOne({ userId: session.sub });

	return { success: true };
});

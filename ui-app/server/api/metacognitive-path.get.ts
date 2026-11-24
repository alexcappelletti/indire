import { readSession } from '../utils/auth-session';
import { getOrCreateUserMetacognitivePath } from '../services/metacognitivePath';

export default defineEventHandler(async (event) => {
	const session = readSession(event);
	if (!session) {
		throw createError({ statusCode: 401, statusMessage: 'Autenticazione richiesta' });
	}

	return getOrCreateUserMetacognitivePath(event, session.sub);
});

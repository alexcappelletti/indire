import { readSession } from '../utils/auth-session';
import { getOrCreateUserMetacognitivePath } from '../services/metacognitivePath';

export default defineEventHandler(async (event) => {
	const session = readSession(event);
	if (!session) {
		throw createError({ statusCode: 401, statusMessage: 'Autenticazione richiesta' });
	}

	if (!session.userId) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Sessione da rinnovare: effettua nuovamente il login',
		});
	}

	return getOrCreateUserMetacognitivePath(event, session.userId, session.email);
});

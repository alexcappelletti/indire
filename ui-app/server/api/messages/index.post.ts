import { readBody } from 'h3';
import type { MessageRequest, MessageResponse } from '#shared/types/api';
import { readSession } from '../../utils/auth-session';
import { createAgentMessage } from '../../services/agentMessage';
import { enforceRateLimit } from '../../utils/rateLimit';

const MAX_MESSAGE_LENGTH = 4_000;

export default defineEventHandler(async (event): Promise<MessageResponse> => {
	const session = readSession(event);
	if (!session) {
		throw createError({ statusCode: 401, statusMessage: 'Autenticazione richiesta' });
	}
	enforceRateLimit(event, `messages:${session.sub}`, 20, 60_000);

	const body = await readBody<Partial<MessageRequest>>(event);
	const message = typeof body?.message === 'string' ? body.message.trim() : '';
	if (!message) {
		throw createError({ statusCode: 400, statusMessage: 'Il messaggio è obbligatorio' });
	}
	if (message.length > MAX_MESSAGE_LENGTH) {
		throw createError({
			statusCode: 413,
			statusMessage: `Il messaggio non può superare ${MAX_MESSAGE_LENGTH} caratteri`,
		});
	}

	const conversationId =
		typeof body?.conversationId === 'string' ? body.conversationId.trim() : undefined;

	try {
		return await createAgentMessage(event, {
			message,
			userId: session.sub,
			conversationId: conversationId || undefined,
		});
	} catch (error: any) {
		if (error?.statusCode) throw error;
		console.error('OpenAI message request failed', error);
		throw createError({
			statusCode: 502,
			statusMessage: 'Impossibile ottenere una risposta da OpenAI',
		});
	}
});

import { OAuth2Client } from 'google-auth-library'
import { setSessionCookie, type SessionUser } from '../../utils/auth-session'
import { ensureMongoConnection } from '../../utils/mongoClient'
import { AuthorizedUserModel } from '../../models/authorizedUser'
import { enforceRateLimit } from '../../utils/rateLimit'
import { getOrCreateUserMetacognitivePath } from '../../services/metacognitivePath'

export default defineEventHandler(async (event) => {
	enforceRateLimit(event, `google-login:${getRequestIP(event) || 'unknown'}`, 10, 15 * 60_000)
	const config = useRuntimeConfig(event)
	const { credential } = await readBody<{ credential?: string }>(event)

	if (!credential || !config.public.googleClientId) {
		throw createError({ statusCode: 400, statusMessage: 'Google Client ID o credential mancante' })
	}

	const client = new OAuth2Client(config.public.googleClientId)
	const ticket = await client.verifyIdToken({
		idToken: credential,
		audience: config.public.googleClientId,
	})
	const payload = ticket.getPayload()

	if (!payload?.sub || !payload.email || payload.email_verified !== true) {
		throw createError({ statusCode: 401, statusMessage: 'Credential Google non valida' })
	}

	await ensureMongoConnection(event)
	const email = payload.email.trim().toLowerCase()
	const authorizedUser = await AuthorizedUserModel.findOne({
		email,
		isActive: true,
	}).lean()

	if (!authorizedUser) {
		throw createError({
			statusCode: 403,
			statusMessage: 'Il tuo account Google non è autorizzato ad accedere alla piattaforma.',
		})
	}

	const userId = String(authorizedUser._id)
	await getOrCreateUserMetacognitivePath(event, userId, email)

	const user: SessionUser = {
		userId,
		sub: payload.sub,
		name: payload.name || email,
		email,
		picture: payload.picture,
	}
	setSessionCookie(event, user)
	return user
})

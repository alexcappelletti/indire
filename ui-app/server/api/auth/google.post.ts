import { OAuth2Client } from 'google-auth-library'
import { setSessionCookie, type SessionUser } from '../../utils/auth-session'

export default defineEventHandler(async (event) => {
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

	if (!payload?.sub || !payload.email) {
		throw createError({ statusCode: 401, statusMessage: 'Credential Google non valida' })
	}

	const user: SessionUser = {
		sub: payload.sub,
		name: payload.name || payload.email,
		email: payload.email,
		picture: payload.picture,
	}
	setSessionCookie(event, user)
	return user
})

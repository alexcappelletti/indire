import { deleteCookie } from 'h3'
import { AUTH_COOKIE } from '../../utils/auth-session'

export default defineEventHandler((event) => {
	deleteCookie(event, AUTH_COOKIE, { path: '/' })
	return { ok: true }
})

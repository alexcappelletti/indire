import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

export const AUTH_COOKIE = 'indire_session'

export type SessionUser = {
	sub: string
	name: string
	email: string
	picture?: string
}

function secret(event: H3Event) {
	const value = useRuntimeConfig(event).sessionSecret
	if (!value) throw createError({ statusCode: 500, statusMessage: 'SESSION_SECRET non configurato' })
	return value
}

function encode(value: string) {
	return Buffer.from(value).toString('base64url')
}

function decode(value: string) {
	return Buffer.from(value, 'base64url').toString('utf8')
}

export function createSessionToken(event: H3Event, user: SessionUser) {
	const payload = encode(JSON.stringify({ user, exp: Date.now() + 1000 * 60 * 60 * 8 }))
	const signature = createHmac('sha256', secret(event)).update(payload).digest('base64url')
	return `${payload}.${signature}`
}

export function readSession(event: H3Event): SessionUser | null {
	const token = getCookie(event, AUTH_COOKIE)
	if (!token) return null

	const [payload, signature] = token.split('.')
	if (!payload || !signature) return null

	const expected = createHmac('sha256', secret(event)).update(payload).digest('base64url')
	const left = Buffer.from(signature)
	const right = Buffer.from(expected)
	if (left.length !== right.length || !timingSafeEqual(left, right)) return null

	try {
		const session = JSON.parse(decode(payload)) as { user: SessionUser; exp: number }
		return session.exp > Date.now() ? session.user : null
	} catch {
		return null
	}
}

export function setSessionCookie(event: H3Event, user: SessionUser) {
	setCookie(event, AUTH_COOKIE, createSessionToken(event, user), {
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 60 * 8,
		path: '/',
	})
}

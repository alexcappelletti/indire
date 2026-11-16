import { readSession } from '../../utils/auth-session'

export default defineEventHandler((event) => ({ user: readSession(event) }))

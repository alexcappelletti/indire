// server/plugins/validate-env.ts
const requiredEnvVars = [
	'SESSION_SECRET',
	'GOOGLE_CLIENT_ID',
	'MONGODB_URI',
] as const;

export default defineNitroPlugin(() => {
	const missing = requiredEnvVars.filter((key) => {
		const value = process.env[key];
		return !value || value.trim().length === 0;
	});

	if (missing.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missing.join(', ')}`,
		);
	}
});

import type { H3Event } from 'h3';

type RateLimitEntry = {
	count: number;
	resetAt: number;
};

const buckets = new Map<string, RateLimitEntry>();

export function enforceRateLimit(
	event: H3Event,
	key: string,
	limit: number,
	windowMs: number,
) {
	const now = Date.now();
	const current = buckets.get(key);

	if (!current || current.resetAt <= now) {
		buckets.set(key, { count: 1, resetAt: now + windowMs });
		return;
	}

	if (current.count >= limit) {
		const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
		setHeader(event, 'Retry-After', String(retryAfter));
		throw createError({
			statusCode: 429,
			statusMessage: 'Troppe richieste. Riprova più tardi.',
		});
	}

	current.count += 1;

	if (buckets.size > 10_000) {
		for (const [bucketKey, bucket] of buckets) {
			if (bucket.resetAt <= now) buckets.delete(bucketKey);
		}
	}
}

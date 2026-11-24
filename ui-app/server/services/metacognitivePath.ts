import type { H3Event } from 'h3';
import type { UserMetacognitivePath } from '#shared/types/metacognition';
import { metacognitivePathMock } from '#shared/mocks/learningMock';
import { UserMetacognitivePathModel } from '../models/userMetacognitivePath';
import { ensureMongoConnection } from '../utils/mongoClient';

export async function getOrCreateUserMetacognitivePath(
	event: H3Event,
	userId: string,
): Promise<UserMetacognitivePath> {
	await ensureMongoConnection(event);

	const existing = await UserMetacognitivePathModel.findOne({ userId }).lean();
	if (existing) {
		return {
			userId: existing.userId,
			path: existing.path as UserMetacognitivePath['path'],
		};
	}

	const created = await UserMetacognitivePathModel.create({
		userId,
		path: structuredClone(metacognitivePathMock),
	});

	return {
		userId: created.userId,
		path: created.path.toObject(),
	};
}

import type { H3Event } from 'h3';
import type { UserMetacognitivePath } from '#shared/types/metacognition';
import { metacognitivePathMock } from '#shared/mocks/learningMock';
import { deriveMetacognitivePath } from '#shared/utils/metacognition';
import { METACOGNITIVE_PATH_SEED_VERSION } from '#shared/constants/metacognition';
import { UserMetacognitivePathModel } from '../models/userMetacognitivePath';
import { ensureMongoConnection } from '../utils/mongoClient';

export async function getOrCreateUserMetacognitivePath(
	event: H3Event,
	userId: string,
	legacyEmail?: string,
): Promise<UserMetacognitivePath> {
	await ensureMongoConnection(event);

	let existing = await UserMetacognitivePathModel.findOne({ userId }).lean();
	if (!existing && legacyEmail) {
		const legacyUserId = legacyEmail.trim().toLowerCase();
		const legacyPath = await UserMetacognitivePathModel.findOne({
			userId: legacyUserId,
		}).lean();
		if (legacyPath) {
			await UserMetacognitivePathModel.updateOne(
				{ userId: legacyUserId },
				{ $set: { userId } },
			);
			existing = { ...legacyPath, userId };
		}
	}
	if (existing) {
		if (existing.seedVersion !== METACOGNITIVE_PATH_SEED_VERSION) {
			const path = deriveMetacognitivePath(
				structuredClone(metacognitivePathMock),
			);
			await UserMetacognitivePathModel.updateOne(
				{ userId },
				{
					$set: {
						path,
						seedVersion: METACOGNITIVE_PATH_SEED_VERSION,
					},
				},
			);

			return { userId: existing.userId, path };
		}

		const path = deriveMetacognitivePath(
			existing.path as UserMetacognitivePath['path'],
		);
		await UserMetacognitivePathModel.updateOne(
			{ userId },
			{
				$set: {
					path,
					seedVersion: METACOGNITIVE_PATH_SEED_VERSION,
				},
			},
		);

		return {
			userId: existing.userId,
			path,
		};
	}

	const path = deriveMetacognitivePath(structuredClone(metacognitivePathMock));
	const created = await UserMetacognitivePathModel.create({
		userId,
		seedVersion: METACOGNITIVE_PATH_SEED_VERSION,
		path,
	});

	return {
		userId: created.userId,
		path: created.path.toObject(),
	};
}

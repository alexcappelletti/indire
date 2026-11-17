import { getQuery } from 'h3';
import { ResourceModel } from '../../models/resource';
import { ensureMongoConnection } from '../../utils/mongoClient';
import { toResourceDto } from '../../utils/resourceDto';

export default defineEventHandler(async (event) => {
	await ensureMongoConnection(event);
	const query = getQuery(event);
	const page = Math.max(Number(query.page) || 1, 1);
	const pageSize = Math.min(Math.max(Number(query.pageSize) || 12, 1), 50);
	const search = String(query.search || '').trim();
	const dateFrom = String(query.dateFrom || '').trim();
	const dateTo = String(query.dateTo || '').trim();
	const filter: Record<string, unknown> = { isPublished: true };

	if (search) {
		const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		filter.$or = [
			{ title: { $regex: escapedSearch, $options: 'i' } },
			{ author: { $regex: escapedSearch, $options: 'i' } },
			{ folderPath: { $regex: escapedSearch, $options: 'i' } },
		];
	}

	if (dateFrom || dateTo) {
		const createdAt: Record<string, Date> = {};
		if (dateFrom) createdAt.$gte = new Date(`${dateFrom}T00:00:00.000Z`);
		if (dateTo) {
			const end = new Date(`${dateTo}T00:00:00.000Z`);
			end.setUTCDate(end.getUTCDate() + 1);
			createdAt.$lt = end;
		}
		filter.createdAt = createdAt;
	}

	const [resources, total] = await Promise.all([
		ResourceModel.find(filter)
			.sort({ createdAt: -1 })
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.lean(),
		ResourceModel.countDocuments(filter),
	]);

	return {
		items: resources.map(toResourceDto),
		total,
		page,
		pageSize,
		hasMore: page * pageSize < total,
	};
});

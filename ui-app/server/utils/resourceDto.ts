import type { Resource } from '#shared/types/resources';

type ResourceRecord = {
	_id: unknown;
	title: string;
	author: string;
	relevance?: number;
	kind: Resource['kind'];
	createdAt?: Date | string;
	folderPath?: string;
	sizeBytes?: number;
};

export function toResourceDto(resource: ResourceRecord): Resource {
	const id = String(resource._id);

	return {
		id,
		title: resource.title,
		author: resource.author,
		relevance: resource.relevance ?? 0,
		kind: resource.kind,
		createdAt: resource.createdAt
			? new Date(resource.createdAt).toISOString()
			: undefined,
		folderPath: resource.folderPath,
		sizeBytes: resource.sizeBytes,
		url: `/api/resources/${id}`,
	};
}

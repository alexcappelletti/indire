export type ResourceKind = 'pdf' | 'presentation';

export type Resource = {
	id: string;
	title: string;
	filename: string;
	author: string;
	relevance: number;
	kind: ResourceKind;
	createdAt?: string;
	folderPath?: string;
	sizeBytes?: number;
	url?: string;
};

export type ResourceUploadInput = {
	title: string;
	author: string;
	folderPath?: string;
};

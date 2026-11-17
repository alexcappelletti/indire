import type { ResourcesResponse } from '#shared/types/api';
import type { Resource } from '#shared/types/resources';

export const mockResources: Resource[] = [
	{
		id: 'mock-resource-001',
		title: "Leggere i segnali: accorgersi in tempo dell'uso di sostanze tra scuola e famiglia",
		author: 'C. Caruso',
		relevance: 94,
		kind: 'pdf',
		createdAt: '2026-11-15T09:30:00.000Z',
		folderPath: 'pdf/prevenzione',
		sizeBytes: 2457600,
	},
	{
		id: 'mock-resource-002',
		title: 'Segnali precoci di dipendenza da sostanze: indicatori comportamentali, fisici e psicologici',
		author: 'C. Caruso',
		relevance: 87,
		kind: 'pdf',
		createdAt: '2026-11-12T14:10:00.000Z',
		folderPath: 'pdf/prevenzione',
		sizeBytes: 3145728,
	},
	{
		id: 'mock-resource-003',
		title: "La scuola come presidio: il ruolo educativo nella prevenzione e nell'intervento precoce",
		author: 'C. Caruso',
		relevance: 79,
		kind: 'pdf',
		createdAt: '2026-11-08T11:45:00.000Z',
		folderPath: 'pdf/formazione',
		sizeBytes: 5242880,
	},
	{
		id: 'mock-resource-004',
		title: 'Presentazione - Adolescenza e vulnerabilità ai comportamenti a rischio',
		author: 'C. Caruso',
		relevance: 68,
		kind: 'presentation',
		createdAt: '2026-11-02T08:20:00.000Z',
		folderPath: 'presentazioni',
		sizeBytes: 7340032,
	},
];

export const mockResourcesResponse: ResourcesResponse = {
	items: mockResources,
	total: 4,
	page: 1,
	pageSize: 12,
	hasMore: false,
};

import type { ResourcesResponse } from '#shared/types/api';
import type { Resource } from '#shared/types/resources';

export const resourcesMock: Resource[] = [
	{
		id: 'mock-resource-001',
		filename: 'leggere-i-segnali.pdf',
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
		filename: 'segnali-precoci-dipendenza.pdf',
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
		filename: 'la-scuola-come-presidio.pdf',
		title: "La scuola come presidio: il ruolo educativo nella prevenzione e nell'intervento precoce",
		author: 'B. Falkner',
		relevance: 79,
		kind: 'pdf',
		createdAt: '2026-11-08T11:45:00.000Z',
		folderPath: 'pdf/formazione',
		sizeBytes: 5242880,
	},
	{
		id: 'mock-resource-004',
		filename: 'adolescenza-e-vulnerabilita.pdf',
		title: 'Presentazione - Adolescenza e vulnerabilità ai comportamenti a rischio',
		author: 'G. Rossi',
		relevance: 68,
		kind: 'presentation',
		createdAt: '2026-11-02T08:20:00.000Z',
		folderPath: 'presentazioni',
		sizeBytes: 7340032,
	},
];

export const resourcesResponseMock: ResourcesResponse = {
	items: resourcesMock,
	total: 4,
	page: 1,
	pageSize: 12,
	hasMore: false,
};

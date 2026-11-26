import type { LearningStep } from '../types/learning.ts';
import type {
	MetacognitivePath,
	MetacognitiveOverviewItem,
	MetacognitiveProgress,
	ReflectionSummary,
	UserMetacognitivePath,
} from '../types/metacognition.ts';
import { deriveMetacognitivePath } from '../utils/metacognition.ts';

export const learningPathMock: LearningStep[] = [
	{ number: 1, title: 'Osservare i segnali', mapLabel: 'Osservare\ni segnali', state: 'completed' },
	{ number: 2, title: 'Organizzare le informazioni', mapLabel: 'Organizzare\nle informazioni', state: 'completed' },
	{ number: 3, title: 'Formulare ipotesi educative', mapLabel: 'Formulare\nipotesi\neducative', state: 'current' },
	{ number: 4, title: 'Confrontare interpretazioni', mapLabel: 'Confrontare\ninterpretazioni', state: 'upcoming' },
	{ number: 5, title: 'Condividere e coinvolgere', mapLabel: 'Condividere\ne coinvolgere', state: 'upcoming' },
	{ number: 6, title: 'Orientare alla rete', mapLabel: 'Orientare\nalla rete', state: 'upcoming' },
	{ number: 7, title: "Pianificare l'azione educativa", mapLabel: "Pianificare\nl'azione\neducativa", state: 'upcoming' },
	{ number: 8, title: 'Verificare e riprogettare', mapLabel: 'Verificare\ne riprogettare', state: 'upcoming' },
];

export const reflectionSummaryMock: ReflectionSummary = {
	text: "Hai osservato più segnali (isolamento, assenze) e formulato un'ipotesi di disagio, considerando anche l'ipotesi alternativa di un cambiamento fisiologico. Stai ampliando la raccolta di elementi per il confronto.",
	updatedAt: '2026-11-17T10:28:00.000Z',
};

export const metacognitiveProgressMock: MetacognitiveProgress = {
	openQuestion: 'Quali ulteriori evidenze, scolastiche o relazionali, possono aiutarti a discriminare tra le ipotesi?',
	currentStepState: 'current',
};

export const overviewItemsMock: MetacognitiveOverviewItem[] = [
	{ label: 'Dimensioni esplorate: 3', detail: '(osservazione, organizzazione, ipotesi)', state: 'completed' },
	{ label: 'Da approfondire: 2', detail: '(condivisione, rete)', state: 'pending' },
	{ label: 'Domanda ancora aperta', detail: metacognitiveProgressMock.openQuestion, state: 'question' },
];

export const metacognitivePathMock: MetacognitivePath = deriveMetacognitivePath({
	steps: learningPathMock,
	progress: metacognitiveProgressMock,
	summary: reflectionSummaryMock,
	overview: overviewItemsMock,
});

export const userMetacognitivePathMock: UserMetacognitivePath = {
	userId: 'mock-user-001',
	path: metacognitivePathMock,
};

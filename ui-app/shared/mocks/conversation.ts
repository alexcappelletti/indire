import type { ConversationMessage } from '#shared/types/conversation';
import type { ConversationResponse } from '#shared/types/api';

export const mockConversationMessages: ConversationMessage[] = [
	{
		role: 'agent',
		text: 'Per iniziare, ti propongo una domanda di riflessione:\nCosa noti, nel tuo contesto scolastico, che potrebbe essere un segnale precoce\ndi disagio o di uso di sostanze in un/a studente/ssa?',
		time: '10:24',
	},
	{
		role: 'user',
		text: 'Ho notato un calo del rendimento e maggiori assenze in un mio alunno,\nma non so se sia un normale periodo di difficoltà.',
		time: '10:27',
	},
	{
		role: 'agent',
		text: "È un'osservazione importante. Ti aiuta a distinguere tra un cambiamento transitorio e\nun possibile segnale di rischio? Quali altri elementi potresti osservare o approfondire nel tempo\n(per esempio, sul piano relazionale, emotivo o fisico)?",
		time: '10:28',
	},
];

export const mockConversationResponse: ConversationResponse = {
	messages: mockConversationMessages,
	isTyping: true,
};

export const mockAgentFollowUp: ConversationMessage = {
	role: 'agent',
	text: "Grazie per aver condiviso questa osservazione. Proviamo a raccogliere altri elementi prima di formulare un'ipotesi.",
	time: '10:32',
};

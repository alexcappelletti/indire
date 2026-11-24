import type {
	ConversationMessage,
	ConversationSession,
} from '#shared/types/conversation';
import type { ConversationResponse } from '#shared/types/api';
import { authUserMock } from './authMock';

export const conversationMessagesMock: ConversationMessage[] = [
	{
		role: 'agent',
		text: 'Per iniziare, ti chiedo di descrivermi un problema che ti piacerebbe affrontare',
		time: '10:24',
	},
];

export const conversationSessionMock: ConversationSession = {
	userId: authUserMock.sub,
	conversationId: 'mock-conversation-001',
	lastResponseId: 'mock-response-001',
	messages: conversationMessagesMock,
};

export const conversationResponseMock: ConversationResponse = {
	messages: conversationMessagesMock,
	isTyping: true,
};

export const agentFollowUpMock: ConversationMessage = {
	role: 'agent',
	text: "Grazie per aver condiviso questa osservazione. Proviamo a raccogliere altri elementi prima di formulare un'ipotesi.",
	time: '10:32',
};

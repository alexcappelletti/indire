import type { ConversationMessage } from '#shared/types/conversation';
import type { ConversationResponse } from '#shared/types/api';

export const conversationMessagesMock: ConversationMessage[] = [
	{
		role: 'agent',
		text: 'Per iniziare, ti chiedo di descrivermi un problema che ti piacerebbe affrontare',
		time: '10:24',
	},
];

export const conversationResponseMock: ConversationResponse = {
	messages: conversationMessagesMock,
	isTyping: true,
};

export const agentFollowUpMock: ConversationMessage = {
	role: 'agent',
	text: "Grazie per aver condiviso questa osservazione. Proviamo a raccogliere altri elementi prima di formulare un'ipotesi.",
	time: '10:32',
};

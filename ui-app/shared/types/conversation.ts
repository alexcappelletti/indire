export type ConversationRole = 'agent' | 'user';

export type ConversationMessage = {
	role: ConversationRole;
	text: string;
	time: string;
};

export type ConversationSession = {
	userId: string;
	conversationId: string;
	lastResponseId?: string;
	messages: ConversationMessage[];
};

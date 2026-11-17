export type ConversationRole = 'agent' | 'user';

export type ConversationMessage = {
	role: ConversationRole;
	text: string;
	time: string;
};

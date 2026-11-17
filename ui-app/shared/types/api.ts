import type { AuthUser } from '#shared/types/auth';
import type { ConversationMessage } from '#shared/types/conversation';
import type { ReflectionSummary } from '#shared/types/metacognition';
import type { Resource } from '#shared/types/resources';

export type ConversationResponse = {
	messages: ConversationMessage[];
	isTyping: boolean;
};

export type ResourcesResponse = {
	items: Resource[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
};

export type ProfileResponse = {
	user: AuthUser | null;
};

export type ReflectionResponse = {
	summary: ReflectionSummary;
};

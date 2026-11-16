import { defineStore } from 'pinia';

export type ConversationMessage = {
	role: 'agent' | 'user';
	text: string;
	time: string;
};

export type AuthUser = {
	sub: string;
	name: string;
	email: string;
	picture?: string;
};

export const useAppStore = defineStore('appStore', () => {
	const error = ref<string | null>(null);
	const title = ref<string>('InDire platform');
	const isLoggedIn = ref(false);
	const authUser = ref<AuthUser | null>(null);
	const conversationMessages = ref<ConversationMessage[]>([]);

	function setError(err: string | null) {
		if (err) {
			error.value = err;
		}
	}

	function addConversationMessage(message: ConversationMessage) {
		conversationMessages.value.push(message);
	}

	function setLoggedIn(value: boolean) {
		isLoggedIn.value = value;
	}

	function setAuthUser(user: AuthUser) {
		authUser.value = user;
		isLoggedIn.value = true;
	}
	const getError = computed(() => error.value);
	const appTitle = computed(() => title.value);

	return {
		getError,
		setError,
		appTitle,
		isLoggedIn,
		setLoggedIn,
		authUser,
		setAuthUser,
		conversationMessages,
		addConversationMessage,
	};
});

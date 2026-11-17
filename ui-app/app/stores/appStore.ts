import { defineStore } from 'pinia';
import type { AuthUser } from '#shared/types/auth';
import type { ConversationMessage } from '#shared/types/conversation';

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

	async function logout() {
		authUser.value = null;
		isLoggedIn.value = false;

		try {
			await $fetch('/api/auth/logout', { method: 'POST' });
		} catch {
			// Lo stato locale resta comunque disconnesso.
		}
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
		logout,
		conversationMessages,
		addConversationMessage,
	};
});

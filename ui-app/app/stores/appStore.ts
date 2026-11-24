import { defineStore } from 'pinia';
import type { AuthUser } from '#shared/types/auth';
import type { ConversationMessage } from '#shared/types/conversation';
import type { ReferenceFile } from '#shared/types/api';
import type { UserMetacognitivePath } from '#shared/types/metacognition';

export const useAppStore = defineStore('appStore', () => {
	const error = ref<string | null>(null);
	const title = ref<string>('InDire platform');
	const isLoggedIn = ref(false);
	const authUser = ref<AuthUser | null>(null);
	const conversationMessages = ref<ConversationMessage[]>([]);
	const referenceFiles = ref<ReferenceFile[]>([]);
	const userMetacognitivePath = ref<UserMetacognitivePath | null>(null);

	function setError(err: string | null) {
		if (err) {
			error.value = err;
		}
	}

	function addConversationMessage(message: ConversationMessage) {
		conversationMessages.value.push(message);
	}

	function clearConversationMessages() {
		conversationMessages.value = [];
		referenceFiles.value = [];
	}

	function setReferenceFiles(files: ReferenceFile[]) {
		referenceFiles.value = files;
	}

	function setLoggedIn(value: boolean) {
		isLoggedIn.value = value;
	}

	function setAuthUser(user: AuthUser) {
		authUser.value = user;
		isLoggedIn.value = true;
		userMetacognitivePath.value = null;
	}

	async function loadUserMetacognitivePath() {
		if (!authUser.value) return;
		userMetacognitivePath.value = await $fetch<UserMetacognitivePath>(
			'/api/metacognitive-path',
		);
	}

	async function logout() {
		authUser.value = null;
		isLoggedIn.value = false;
		userMetacognitivePath.value = null;

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
		clearConversationMessages,
		referenceFiles,
		setReferenceFiles,
		userMetacognitivePath,
		loadUserMetacognitivePath,
	};
});

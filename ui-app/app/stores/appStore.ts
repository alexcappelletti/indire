import { defineStore } from 'pinia';

export type ConversationMessage = {
	role: 'agent' | 'user'
	text: string
	time: string
}



export const useAppStore = defineStore('appStore', ()=>{
	const error = ref<string|null> (null)
	const title = ref<string>('InDire platform')
	const conversationMessages = ref<ConversationMessage[]>([])

	function setError(err: string|null){
		if (err) {
			error.value = err;
		}
	}

	function addConversationMessage(message: ConversationMessage) {
		conversationMessages.value.push(message)
	}
	const getError = computed(() => error.value)
	const appTitle = computed(()=> title.value)


	return {
		getError,
		setError,
		appTitle,
		conversationMessages,
		addConversationMessage,
	}

})

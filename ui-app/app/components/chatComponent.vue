<script setup lang="ts">
	import { nextTick, onMounted, ref, watch } from 'vue';
	import DOMPurify from 'isomorphic-dompurify';
	import { storeToRefs } from 'pinia';
	import { marked } from 'marked';
	import { useAppStore } from '@/stores/appStore';
	import type { MessageResponse } from '#shared/types/api';
	import type { ConversationMessage } from '#shared/types/conversation';
	import {conversationMessagesMock} from '#shared/mocks/conversationMock';

	definePageMeta({ layout: 'main-layout' });

	const draft = ref('');
	const isTyping = ref(false);
	const conversationId = ref<string>();
	const appStore = useAppStore();
	const { authUser, referenceFiles } = storeToRefs(appStore);

	const messagesArea = ref<{ $el?: HTMLElement } | HTMLElement | null>(null);
	const messages = ref<ConversationMessage[]>(conversationMessagesMock);
	

	function renderMarkdown(text: string) {
		const citationPattern = new RegExp('\\uE200filecite\\uE202([^\\uE201]+)\\uE201', 'g');
		const citationSeparator = String.fromCodePoint(0xE202);
		const normalizedText = text.replace(citationPattern, (_match, ids: string) => {
			const filenames = ids
				.split(citationSeparator)
				.map((id) => Number(id.match(/file(\d+)$/)?.[1]))
				.filter((index) => Number.isInteger(index))
				.map((index) => referenceFiles.value[index]?.filename)
				.filter((filename): filename is string => Boolean(filename));

			return filenames.length ? ` (${filenames.join(', ')})` : '';
		});

		return DOMPurify.sanitize(marked.parse(normalizedText, { async: false }));
	}

	function renderMarkdownLegacy(text: string) {
		const normalizedText = text.replace(/filecite([^]+)/g, (_match, ids: string) => {
			const filenames = ids
				.split('')
				.map((id) => Number(id.match(/file(\d+)$/)?.[1]))
				.filter((index) => Number.isInteger(index))
				.map((index) => referenceFiles.value[index]?.filename)
				.filter((filename): filename is string => Boolean(filename));

			return filenames.length ? ` (${filenames.join(', ')})` : '';
		});

		return DOMPurify.sanitize(marked.parse(normalizedText, { async: false }));
	}

	function formatMessageTime(value: string) {
		if (/^\d{2}:\d{2}$/.test(value)) return value;
		const date = new Date(value);
		return Number.isNaN(date.getTime())
			? value
			: date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
	}

	async function sendMessage() {
		const text = draft.value.trim();
		if (!text || isTyping.value) return;

		// Svuota subito la textarea dopo l'invio.
		draft.value = '';
		appStore.addConversationMessage({ role: 'user', text, time: '10:31' });
		messages.value.push({ role: 'user', text, time: '10:31' });
		isTyping.value = true;

		try {
			const response = await $fetch<MessageResponse>('/api/messages', {
				method: 'POST',
				body: { message: text, conversationId: conversationId.value },
			});
			conversationId.value = response.conversationId;
			messages.value.push(response.message);
			appStore.setReferenceFiles(response.referenceFiles);
			appStore.addConversationMessage(response.message);
		} catch (error: any) {
			messages.value.push({
				role: 'agent',
				text: `**Non riesco a completare la richiesta.** ${error?.data?.statusMessage || error?.message || 'Riprova tra poco.'}`,
				time: new Date().toISOString(),
			});
		} finally {
			isTyping.value = false;
		}
	}

	async function clearConversation() {
		messages.value = [];
		conversationId.value = undefined;
		isTyping.value = false;
		appStore.clearConversationMessages();

		try {
			await $fetch('/api/messages', { method: 'DELETE' });
		} catch (error) {
			console.error('Impossibile cancellare la conversazione sul server', error);
		}
	}

	async function scrollMessagesToBottom() {
		await nextTick();
		const target = messagesArea.value;
		const area = target instanceof HTMLElement ? target : target?.$el;
		if (!area) return;

		area.scrollTo({
			top: area.scrollHeight,
			behavior: 'smooth',
		});
	}

	watch([messages, isTyping], scrollMessagesToBottom, { deep: true });
	onMounted(scrollMessagesToBottom);
</script>

<template>
	<v-card class="conversation-card" elevation="0">
		<v-card-title class="conversation-header">
			<v-avatar class="sparkle-avatar" size="82">
				<v-icon size="48" color="#3039c8">mdi-auto-fix</v-icon>
			</v-avatar>
			<v-sheet class="conversation-heading" color="transparent">
				<h1>
					Agente riflessivo - Dialogo socratico
					<v-icon class="info-badge" size="22" color="#2860bf"
						>mdi-information-outline</v-icon
					>
				</h1>
				<p>
					Ti accompagno in un percorso di riflessione professionale
					sul disagio giovanile e sulla
					<span class="desktop-only"><br /></span>prevenzione delle
					dipendenze, attraverso domande, approfondimenti e rimandi ai
					materiali della piattaforma.
				</p>
			</v-sheet>
			<v-btn
				class="guide-button"
				variant="outlined"
				prepend-icon="mdi-book-open-page-variant"
			>
				Guida al dialogo
			</v-btn>
			<v-btn
				class="clear-conversation-button"
				variant="text"
				icon="mdi-delete-sweep-outline"
				aria-label="Cancella conversazione"
				title="Cancella conversazione"
				@click="clearConversation"
			/>
		</v-card-title>

		<v-card-text ref="messagesArea" class="messages-area">
			<v-sheet
				v-for="(message, index) in messages"
				:key="index"
				class="message-row"
				:class="message.role"
				color="transparent"
			>
				<v-avatar
					v-if="message.role === 'agent'"
					class="message-avatar agent-avatar"
					size="66"
				>
					<v-icon size="38">mdi-robot-outline</v-icon>
				</v-avatar>
				<v-sheet class="message-bubble" color="transparent">
					<div v-if="message.role === 'agent'" class="markdown-body" v-html="renderMarkdown(message.text)" />
					<span v-else
						v-for="(line, lineIndex) in message.text.split('\n')"
						:key="lineIndex"
						>{{ line
						}}<br
							v-if="
								lineIndex < message.text.split('\n').length - 1
							"
					/></span>
					<time>{{ formatMessageTime(message.time) }}</time>
				</v-sheet>
				<v-avatar
					v-if="message.role === 'user'"
					class="message-avatar user-avatar"
					size="66"
				>
					<v-img
						v-if="authUser?.picture"
						:src="authUser.picture"
						:alt="authUser.name"
						cover
					/>
					<v-icon v-else size="38">mdi-account</v-icon>
				</v-avatar>
			</v-sheet>
			<v-sheet
				v-if="isTyping"
				class="message-row agent typing-row"
				color="transparent"
			>
				<v-avatar class="message-avatar agent-avatar" size="66"
					><v-icon size="38">mdi-robot-outline</v-icon></v-avatar
				>
				<v-sheet class="typing-bubble" color="transparent">
					<v-icon
						v-for="dot in 3"
						:key="dot"
						class="typing-dot"
						size="10"
						>mdi-circle</v-icon
					>
				</v-sheet>
			</v-sheet>
		</v-card-text>

		<v-form class="composer" @submit.prevent="sendMessage">
			<v-textarea
				class="flex-grow-1"
				v-model="draft"
				aria-label="Scrivi la tua risposta"
				placeholder="Scrivi la tua risposta..."
				variant="plain"
				bg-color="transparent"
				auto-grow
				:rows="1"
				:max-rows="4"
				hide-details
			/>
			<v-btn
				type="submit"
				class="send-button"
				icon
				aria-label="Invia risposta"
			>
				<v-icon size="26">mdi-send</v-icon>
			</v-btn>
		</v-form>
	</v-card>
</template>
<style scoped lang="scss">
	.conversation-card {
		min-height: calc(100vh - 122px);
		overflow: hidden;
		border: 2px solid #dce5fa;
		border-radius: 24px;
		background: #fff;
		box-shadow: 0 3px 12px #294c9912;
	}

	.conversation-header {
		min-height: 100px;
		display: flex;
		align-items: flex-start;
		gap: 18px;
		padding: 10px 16px 8px;
		background: linear-gradient(180deg, #eff3ff 0%, #f6f8ff 90%, #fff 100%);
	}

	.sparkle-avatar {
		flex: 0 0 82px;
		width: 82px;
		height: 82px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		color: #3039c8;
		background: radial-gradient(
			circle at 35% 30%,
			#fff 0,
			#e7e8ff 58%,
			#d8ddff 100%
		);
	}

	.sparkle-avatar span {
		font-size: 48px;
	}

	.sparkle-avatar .v-icon {
		flex: 0 0 auto;
	}

	.conversation-heading {
		flex: 1;
	}

	.conversation-heading h1 {
		margin: 2px 0 5px;
		color: #102c7f;
		font-size: 22px;
		font-weight: 800;
		line-height: 1.15;
	}

	.conversation-heading p {
		margin: 0;
		color: #13214d;
		font-size: 14px;
		font-weight: 600;
		line-height: 1.35;
	}

	.info-badge {
		display: inline-grid;
		place-items: center;
		width: 22px;
		height: 22px;
		margin-left: 5px;
		border: 2px solid #6781ca;
		border-radius: 50%;
		color: #2860bf;
		font-size: 14px;
		vertical-align: 3px;
	}

	.guide-button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		flex: 0 0 auto;
		padding: 11px 16px;
		border: 1px solid #b8c9f0;
		border-radius: 15px;
		background: #fff;
		color: #104ab1;
		font-weight: 800;
		box-shadow: 0 3px 8px #9cb7ee50;
	}

	.guide-button span {
		font-size: 26px;
	}

	.guide-button :deep(.v-icon) {
		font-size: 26px;
	}

	.clear-conversation-button {
		flex: 0 0 auto;
		color: #b3261e;
	}

	.messages-area {
		height: 0;
		flex: 1 1 0;
		min-height: calc(100vh - 350px);
		padding: 26px 37px 20px;
		background: #fff;
		overflow-y: auto;
	}

	.message-row {
		display: flex;
		align-items: flex-start;
		gap: 15px;
		margin-bottom: 28px;
	}

	.message-row.user {
		justify-content: flex-end;
	}

	.message-avatar {
		flex: 0 0 66px;
		width: 66px;
		height: 66px;
		display: grid;
		place-items: center;
		border-radius: 50%;
	}

	.message-avatar span {
		font-size: 38px;
	}

	.message-avatar :deep(.v-icon) {
		font-size: 38px;
	}

	.agent-avatar {
		color: #0e3f9e;
		background: #edf3ff;
	}

	.user-avatar {
		color: #1d5dc0;
		background: #e5edff;
	}

	.user-avatar :deep(.v-img) {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		overflow: hidden;
	}

	.message-bubble {
		max-width: calc(100% - 82px);
		padding: 14px 20px 8px;
		border: 2px solid #dce4f4;
		border-radius: 17px;
		color: #111b3a;
		font-size: 16px;
		font-weight: 600;
		line-height: 1.38;
	}

	.markdown-body :deep(p) {
		margin: 0 0 0.65em;
	}

	.markdown-body :deep(p:last-child) {
		margin-bottom: 0;
	}

	.markdown-body :deep(strong) {
		font-weight: 800;
	}

	.markdown-body :deep(ul),
	.markdown-body :deep(ol) {
		margin: 0.45em 0 0.65em 1.2em;
		padding: 0;
	}

	.markdown-body :deep(li + li) {
		margin-top: 0.25em;
	}

	.markdown-body :deep(h3),
	.markdown-body :deep(h4) {
		margin: 0.65em 0 0.35em;
		color: #102c7f;
		font-size: 1em;
		font-weight: 800;
	}

	.markdown-body :deep(blockquote) {
		margin: 0.6em 0;
		padding-left: 0.8em;
		border-left: 3px solid #b8c9f0;
		color: #526384;
	}

	.user .message-bubble {
		max-width: 72%;
		border: 0;
		background: #e9edff;
	}

	.message-bubble time {
		display: block;
		margin-top: 3px;
		color: #536487;
		font-size: 12px;
		text-align: right;
		font-weight: 500;
	}

	.typing-row {
		margin-top: 5px;
	}

	.typing-bubble {
		display: flex;
		align-items: center;
		gap: 7px;
		height: 48px;
		padding: 0 21px;
		border-radius: 17px;
		background: #eaf0ff;
	}

	.typing-bubble i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #2868d5;
		animation: pulse 1s infinite alternate;
	}

	.typing-bubble i:nth-child(2) {
		animation-delay: 0.2s;
	}

	.typing-bubble i:nth-child(3) {
		animation-delay: 0.4s;
	}

	.typing-bubble .typing-dot {
		width: 8px;
		height: 8px;
		color: #2868d5;
		animation: pulse 1s infinite alternate;
	}

	.typing-bubble .typing-dot:nth-child(2) {
		animation-delay: 0.2s;
	}

	.typing-bubble .typing-dot:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes pulse {
		to {
			opacity: 0.25;
			transform: translateY(-4px);
		}
	}

	.composer {
		display: flex;
		align-items: center;
		min-height: 52px;
		height: auto;
		max-height: 150px;
		margin: 0 24px 22px;
		padding: 3px 5px 3px 16px;
		border: 2px solid #afbddc;
		border-radius: 17px;
		background: #fff;
	}

	.composer .send-button {
		width: 48px;
		min-width: 48px;
		flex: 0 0 48px;
		height: 42px;
		display: grid;
		place-items: center;
		border: 0;
		border-radius: 12px;
		color: #fff;
		background: linear-gradient(135deg, #7e9be0, #5b71b2) !important;
	}

	.composer .send-button :deep(.v-icon) {
		font-size: 25px;
		transform: rotate(-27deg);
	}

	@media (max-width: 800px) {
		.conversation-header {
			padding: 16px;
			gap: 11px;
		}

		.sparkle-avatar {
			flex-basis: 54px;
			width: 54px;
			height: 54px;
		}

		.sparkle-avatar span {
			font-size: 32px;
		}

		.conversation-heading h1 {
			font-size: 19px;
		}

		.conversation-heading p {
			font-size: 13px;
		}

		.guide-button {
			padding: 8px;
			font-size: 0;
		}

		.guide-button span {
			font-size: 22px;
		}

		.messages-area {
			padding: 20px 14px;
		}

		.message-avatar {
			flex-basis: 42px;
			width: 42px;
			height: 42px;
		}

		.message-avatar :deep(.v-icon) {
			font-size: 25px;
		}

		.message-bubble,
		.user .message-bubble {
			max-width: 84%;
			font-size: 15px;
			padding: 10px 13px 7px;
		}

		.composer {
			margin: 0 12px 14px;
		}

		.desktop-only {
			display: none;
		}
	}
</style>

<script setup lang="ts">
	import { nextTick, ref } from 'vue';
	import chatComponent from '@/components/chatComponent.vue';
	import metacognitivePanel from '@/components/metacognitivePanel.vue';
	import indexedResPanel from '@/components/indexedResPanel.vue';

	definePageMeta({ layout: 'main-layout' });
</script>

<template>
	<v-container fluid class="conversation-page">
		<v-row class="conversation-main-row" no-gutters>
			<v-col cols="9" class="chat-panel">
				<chatComponent />
			</v-col>
			<v-col cols="3" class="resources-panel-wrapper">
				<indexedResPanel />
			</v-col>
		</v-row>
		<metacognitivePanel class="metacognitive-panel-wrapper" />
	</v-container>
</template>
<style scoped lang="scss">
	.conversation-page {
		height: calc(100vh - 88px);
		max-height: calc(100vh - 88px);
		max-width: 100%;
		display: flex;
		flex-direction: column;
		gap: 12px;
		overflow: hidden;
		padding: 12px 4px;
		box-sizing: border-box;
	}

	.chat-panel,
	.resources-panel-wrapper,
	.metacognitive-panel-wrapper {
		min-height: 0;
		width: 100%;
	}

	.conversation-main-row {
		flex: 1 1 auto;
		min-height: 0;
		width: 100%;
	}

	.conversation-main-row > .v-col {
		height: 100%;
	}

	.conversation-main-row > .chat-panel {
		padding-right: 6px;
	}
	.conversation-main-row > .resources-panel-wrapper {
		padding-left: 6px;
	}

	.resources-panel-wrapper {
		height: 100%;
	}

	.metacognitive-panel-wrapper {
		flex: 0 0 auto;
		height: auto;
	}

	.conversation-page :deep(.conversation-card) {
		height: 100%;
		min-height: 0;
		display: flex;
		flex-direction: column;
	}

	.conversation-page :deep(.conversation-header) {
		flex: 0 0 auto;
	}

	.conversation-page :deep(.messages-area) {
		min-height: 0;
		flex: 1 1 auto;
		overflow-y: auto;
	}

	.conversation-page :deep(.composer) {
		flex: 0 0 auto;
	}

	.conversation-page :deep(.metacognitive-panel) {
		height: auto;
		min-height: 270px;
		margin-top: 0;
		display: flex;
		flex-direction: column;
		overflow: visible;
	}

	.conversation-page :deep(.metacognitive-panel .panel-content) {
		min-height: 0;
		flex: 0 0 auto;
		overflow: visible;
	}

	@media (max-width: 900px) {
		.conversation-main-row {
			overflow-y: auto;
		}

		.conversation-main-row .chat-panel,
		.resources-panel-wrapper {
			padding-left: 0;
			padding-right: 0;
			flex: 0 0 100%;
			max-width: 100%;
			height: 480px;
		}
	}
</style>

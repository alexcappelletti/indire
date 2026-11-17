<script setup lang="ts">
	import { platformResources } from '#shared/data/resources';

	const resources = platformResources; /*
		{
			title: 'Presentazione – Adolescenza e vulnerabilità ai comportamenti a rischio',
			author: 'C. Caruso',
			relevance: 68,
		},
	*/
</script>

<template>
	<v-card class="resources-panel" elevation="0">
		<v-card-title class="resources-header">
			<v-icon class="folder-icon" size="48" color="#1554be"
				>mdi-folder-outline</v-icon
			>
			<div color="transparent" class="resources-heading">
				<h2>Risorse dalla piattaforma</h2>
				<p>
					Materiali consigliati dall'agente in relazione al tuo
					dialogo. La rilevanza indica quanto il materiale è
					pertinente (calcolata dall'agente sulla base del tuo
					contributo).
				</p>
			</div>
		</v-card-title>

		<v-card-text class="resources-list">
			<v-sheet
				v-for="resource in resources"
				:key="resource.title"
				class="resource-item"
				color="transparent"
			>
				<v-icon class="pdf-icon" size="38" color="#e52d2d"
					>mdi-file-pdf-box</v-icon
				>
				<v-sheet class="resource-copy" color="transparent">
					<strong>{{ resource.title }}</strong>
					<span>{{ resource.author }}</span>
				</v-sheet>
				<v-sheet class="resource-relevance" color="transparent">
					<span>Rilevanza</span>
					<strong>{{ resource.relevance }}%</strong>
					<v-progress-linear
						:model-value="resource.relevance"
						:color="resource.relevance < 70 ? '#f6bd2d' : '#45b95d'"
						bg-color="#dfe3e8"
						height="9"
						rounded
					/>
				</v-sheet>
				<v-btn
					icon
					variant="text"
					size="small"
					color="#1554be"
					aria-label="Apri risorsa"
				>
					<v-icon size="23">mdi-open-in-new</v-icon>
				</v-btn>
			</v-sheet>
		</v-card-text>

		<v-card-actions class="resources-footer">
			<v-btn
				variant="text"
				color="#1554be"
				append-icon="mdi-arrow-right"
				class="all-resources-button"
			>
				Vedi tutte le risorse correlate (12)
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<style scoped lang="scss">
	.resources-panel {
		height: 100%;
		min-height: 0;
		overflow-x: hidden;
		overflow-y: auto;
		border: 2px solid #dce5fa;
		border-radius: 22px;
		background: #fff;
		box-shadow: 0 3px 12px #294c9912;
		color: #12245d;
	}

	.resources-header {
		display: flex;
		align-items: flex-start;
		gap: 14px;
		min-width: 0;
		min-height: 120px;
		padding: 20px 20px 14px;
		background: linear-gradient(180deg, #eff3ff 0%, #f6f8ff 90%, #fff 100%);
		overflow: hidden;
		white-space: normal;
	}

	.folder-icon {
		flex: 0 0 auto;
		margin-top: 3px;
	}

	.resources-heading {
		flex: 1 1 auto;
		width: auto;
		max-width: none;
		min-width: 0;
		overflow-wrap: anywhere;
		white-space: normal;
	}

	.resources-heading h2 {
		max-width: 100%;
		overflow-wrap: anywhere;
		word-break: break-word;
		color: #102c7f;
		font-size: 21px;
		font-weight: 800;
		line-height: 1.15;
	}

	.resources-heading p {
		max-width: 100%;
		overflow-wrap: anywhere;
		word-break: break-word;
		white-space: normal;
		margin-top: 6px;
		color: #13214d;
		font-size: 14px;
		font-weight: 600;
		line-height: 1.3;
	}

	.resources-list {
		width: 100%;
		max-width: 100%;
		min-width: 0;
		padding: 0 16px;
		overflow: visible;
		box-sizing: border-box;
	}

	.resource-item {
		width: 100%;
		max-width: 100%;
		min-width: 0;
		box-sizing: border-box;
		display: grid;
		grid-template-columns: 42px minmax(0, 1fr) 105px 28px;
		align-items: center;
		gap: 8px;
		min-height: 82px;
		padding: 10px 0;
		border-bottom: 1px solid #dbe1ed;
	}

	.pdf-icon {
		align-self: center;
	}

	.resource-copy {
		min-width: 0;
	}

	.resource-copy strong {
		display: block;
		color: #111b3a;
		font-size: 14px;
		line-height: 1.18;
	}

	.resource-copy span {
		display: block;
		margin-top: 4px;
		color: #17254d;
		font-size: 13px;
	}

	.resource-copy,
	.resource-relevance {
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.resource-relevance span,
	.resource-relevance strong {
		display: block;
		color: #17254d;
		font-size: 12px;
		line-height: 1.15;
	}

	.resource-relevance strong {
		margin-top: 2px;
		font-size: 15px;
	}

	.resource-relevance :deep(.v-progress-linear) {
		margin-top: 6px;
	}

	.resources-footer {
		justify-content: center;
		padding: 8px 10px 12px;
	}

	.all-resources-button {
		font-size: 14px;
		font-weight: 700;
		text-decoration: underline;
	}

	@media (max-width: 950px) {
		.resource-item {
			grid-template-columns: 34px minmax(0, 1fr) 82px 24px;
		}

		.resource-copy strong {
			font-size: 12px;
		}

		.resource-copy span {
			font-size: 11px;
		}

		.resource-relevance strong {
			font-size: 13px;
		}
	}
</style>

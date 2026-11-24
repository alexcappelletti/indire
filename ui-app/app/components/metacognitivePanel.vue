<script setup lang="ts">
	import { computed } from 'vue';
	import { storeToRefs } from 'pinia';
	import { useAppStore } from '@/stores/appStore';

	const { userMetacognitivePath } = storeToRefs(useAppStore());
	const path = computed(() => userMetacognitivePath.value?.path);
	const steps = computed(() => path.value?.steps ?? []);
	const summary = computed(() => path.value?.summary);
	const overview = computed(() => path.value?.overview ?? []);
</script>

<template>
	<v-card
		class="metacognitive-panel"
		elevation="0"
		aria-labelledby="metacognitive-title"
	>
		<v-card-title class="panel-header">
			<v-avatar class="header-icon" size="55" color="transparent">
				<v-icon size="52" color="primary">mdi-head-cog-outline</v-icon>
			</v-avatar>
			<h2 id="metacognitive-title">Il tuo percorso metacognitivo</h2>
			<v-tooltip text="Informazioni sul percorso">
				<template #activator="{ props }">
					<v-icon
						v-bind="props"
						class="info-icon"
						size="22"
						color="primary"
						>mdi-information-outline</v-icon
					>
				</template>
			</v-tooltip>
		</v-card-title>

		<v-card-text class="panel-content">
			<v-row no-gutters>
				<v-col cols="12" lg="6" class="reasoning-map">
					<v-sheet class="section-title-row" color="transparent">
						<h3 id="map-title">
							Tappe del ragionamento professionale (Mappa)
						</h3>
						<v-icon size="20" color="primary"
							>mdi-information-outline</v-icon
						>
					</v-sheet>

					<v-sheet class="steps-track" color="transparent">
						<v-sheet
							v-for="step in steps"
							:key="step.number"
							class="step"
							:class="step.state"
							color="transparent"
						>
							<v-avatar class="step-marker" size="37">
								<v-icon
									v-if="step.state === 'completed'"
									size="21"
									>mdi-check</v-icon
								>
								<span v-else>{{ step.number }}</span>
							</v-avatar>
							<v-card-subtitle class="step-number">{{
								step.number
							}}</v-card-subtitle>
							<v-card-text class="step-label">{{
								step.mapLabel
							}}</v-card-text>
						</v-sheet>
					</v-sheet>
				</v-col>

				<v-col cols="12" lg="3" class="reflection-summary">
					<v-card elevation="0" class="summary-card">
						<v-card-title class="summary-title">
							<v-icon size="27" color="primary"
								>mdi-file-document-outline</v-icon
							>
							<h3 id="summary-title">
								Sintesi provvisoria della tua riflessione
							</h3>
						</v-card-title>
						<v-card-text>{{ summary?.text || 'Nessuna sintesi disponibile.' }}</v-card-text>
					</v-card>
				</v-col>

				<v-col
					cols="12"
					lg="3"
					class="overview"
					aria-labelledby="overview-title"
				>
					<v-sheet class="overview-title" color="transparent">
						<v-icon size="34" color="primary">mdi-target</v-icon>
						<h3 id="overview-title">A colpo d'occhio</h3>
					</v-sheet>
					<v-sheet
						v-for="item in overview"
						:key="item.label"
						class="overview-item"
						:class="item.state"
						color="transparent"
					>
						<v-avatar class="status-icon" size="29" color="transparent">
							<v-icon v-if="item.state === 'completed'" size="19">mdi-check</v-icon>
							<span v-else-if="item.state === 'question'">?</span>
						</v-avatar>
						<v-card-text class="overview-copy">
							<strong>{{ item.label }}</strong><br />
							<span>{{ item.detail }}</span>
						</v-card-text>
					</v-sheet>
					
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<style scoped lang="scss">
	.metacognitive-panel {
		margin-top: 20px;
		border: 2px solid var(--indire-border);
		border-radius: 22px;
		overflow: hidden;
		background: var(--indire-white);
		box-shadow: $shadow-card;
		color: var(--indire-ink);
	}

	.panel-header {
		display: flex;
		align-items: center;
		gap: 15px;
		min-height: 70px;
		padding: 8px 32px;
		background: linear-gradient(
			90deg,
			var(--indire-blue-soft),
			var(--indire-blue-soft) 55%,
			var(--indire-white)
		);
	}

	.header-icon {
		width: 55px;
		height: 55px;
		display: grid;
		place-items: center;
		color: var(--indire-primary);
	}

	.header-icon span {
		font-size: 52px;
	}

	h2,
	h3,
	p {
		margin: 0;
	}

	.panel-header h2 {
		color: var(--indire-navy);
		font-size: 21px;
		font-weight: 800;
	}

	.info-icon {
		display: inline-grid;
		place-items: center;
		width: 22px;
		height: 22px;
		border: 2px solid var(--indire-primary);
		border-radius: 50%;
		color: var(--indire-primary);
		font-size: 14px;
		font-weight: 800;
	}

	.info-icon.small {
		width: 20px;
		height: 20px;
		font-size: 12px;
	}

	.panel-content {
		padding: 18px 22px 20px;
	}

	.panel-content > .v-row {
		align-items: stretch;
	}

	.reasoning-map,
	.reflection-summary,
	.overview {
		min-width: 0;
		padding: 0 22px;
	}

	.reflection-summary,
	.overview {
		border-left: 2px solid var(--indire-border);
	}

	.section-title-row,
	.summary-title,
	.overview-title {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.section-title-row h3,
	.summary-title h3,
	.overview-title h3 {
		color: var(--indire-navy);
		font-size: 16px;
		font-weight: 800;
		line-height: 1.2;
	}

	.steps-track {
		display: flex;
		position: relative;
		justify-content: space-between;
		margin-top: 23px;
	}

	.steps-track::before {
		content: '';
		position: absolute;
		left: 22px;
		right: 22px;
		top: 18px;
		height: 3px;
		background: var(--indire-border);
	}

	.step {
		position: relative;
		z-index: 1;
		width: 12.5%;
		text-align: center;
	}

	.step-marker {
		width: 37px;
		height: 37px;
		display: grid;
		place-items: center;
		margin: 0 auto;
		border-radius: 50%;
		background: var(--indire-blue-soft);
		color: var(--indire-ink);
		font-size: 17px;
		font-weight: 700;
	}

	.step-marker span {
		font-size: 21px;
	}
	.step.completed .step-marker {
		background: rgb(var(--v-theme-primary));
		color: var(--indire-white);
	}
	.step.current .step-marker {
		border: 2px solid var(--indire-primary);
		background: var(--indire-white);
		color: var(--indire-primary);
	}
	.step-number {
		margin-top: 7px;
		padding: 0;
		font-size: 14px;
		font-weight: 700;
	}
	.step-label {
		min-height: 48px;
		padding: 0;
		white-space: pre-line;
		margin-top: 5px;
		font-size: 13px;
		line-height: 1.2;
		font-weight: 600;
	}

	.reflection-summary {
		padding-top: 0;
	}
	.reflection-summary .summary-title {
		padding: 10px 20px;
		border-radius: 15px 15px 0 0;
		background: var(--indire-blue-soft);
	}
	.summary-title span {
		color: var(--indire-primary);
		font-size: 27px;
	}
	.summary-card {
		overflow: hidden;
		border-radius: 15px;
		background: transparent;
	}
	.summary-card > .v-card-text {
		padding: 13px 18px;
		border-radius: 0 0 15px 15px;
		background: var(--indire-blue-soft);
		color: var(--indire-ink);
		font-size: 13px;
		line-height: 1.42;
		font-weight: 600;
	}

	.overview-title {
		margin-bottom: 10px;
	}
	.target-icon {
		color: var(--indire-primary);
		font-size: 34px;
	}
	.overview-item {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		margin-top: 9px;
		font-size: 14px;
		line-height: 1.25;
	}
	.overview-item .overview-copy {
		padding: 0;
		color: var(--indire-ink);
		font-size: 12px;
		line-height: 1.25;
	}
	.overview-item strong {
		font-size: 13px;
	}
	.overview-item span:not(.status-icon) {
		font-weight: 600;
	}
	.status-icon {
		width: 29px;
		height: 29px;
		display: inline-grid;
		place-items: center;
		flex: 0 0 29px;
		border-radius: 50%;
	}
	.completed .status-icon {
		background: rgb(var(--v-theme-primary));
		color: var(--indire-white);
		font-size: 19px;
	}
	.pending .status-icon {
		border: 2px solid var(--indire-muted);
	}
	.question .status-icon {
		border: 2px solid var(--indire-primary);
		color: var(--indire-primary);
		font-size: 18px;
		font-weight: 700;
	}

	@media (max-width: 1100px) {
		.overview {
			border-left: 0;
			border-top: 2px solid var(--indire-border);
			padding-top: 18px;
		}
	}

	@media (max-width: 700px) {
		.panel-header {
			padding: 10px 16px;
		}
		.panel-header h2 {
			font-size: 19px;
		}
		.panel-content {
			display: block;
			padding: 16px;
		}
		.reasoning-map,
		.reflection-summary,
		.overview {
			padding: 0;
		}
		.reflection-summary,
		.overview {
			margin-top: 22px;
			padding-top: 22px;
			border-left: 0;
			border-top: 2px solid var(--indire-border);
		}
		.steps-track {
			overflow-x: auto;
			justify-content: flex-start;
			padding-bottom: 8px;
		}
		.step {
			min-width: 92px;
		}
		.steps-track::before {
			left: 28px;
			right: auto;
			width: calc(8 * 92px - 56px);
		}
		.step-label {
			font-size: 11px;
		}
		.wide-only {
			display: none;
		}
	}
</style>

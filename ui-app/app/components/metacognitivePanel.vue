<script setup lang="ts">
	import { mockMetacognitivePath } from '#shared/mocks/learning';

	const { steps } = mockMetacognitivePath;
</script>

<template>
	<v-card
		class="metacognitive-panel"
		elevation="0"
		aria-labelledby="metacognitive-title"
	>
		<v-card-title class="panel-header">
			<v-avatar class="header-icon" size="55" color="transparent">
				<v-icon size="52" color="#243fc9">mdi-head-cog-outline</v-icon>
			</v-avatar>
			<h2 id="metacognitive-title">Il tuo percorso metacognitivo</h2>
			<v-tooltip text="Informazioni sul percorso">
				<template #activator="{ props }">
					<v-icon
						v-bind="props"
						class="info-icon"
						size="22"
						color="#3159bf"
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
						<v-icon size="20" color="#3159bf"
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
							<v-icon size="27" color="#1855c1"
								>mdi-file-document-outline</v-icon
							>
							<h3 id="summary-title">
								Sintesi provvisoria della tua riflessione
							</h3>
						</v-card-title>
						<v-card-text>
							Hai osservato più segnali (isolamento, assenze) e
							formulato un'ipotesi di disagio, considerando anche
							l'ipotesi alternativa di un cambiamento fisiologico.
							Stai ampliando la raccolta di elementi per
							confronto.
						</v-card-text>
					</v-card>
				</v-col>

				<v-col
					cols="12"
					lg="3"
					class="overview"
					aria-labelledby="overview-title"
				>
					<v-sheet class="overview-title" color="transparent">
						<v-icon size="34" color="#174fc0">mdi-target</v-icon>
						<h3 id="overview-title">A colpo d'occhio</h3>
					</v-sheet>
					<v-sheet class="overview-item explored" color="transparent">
						<v-avatar class="status-icon" size="29" color="#41b95c"
							><v-icon size="19">mdi-check</v-icon></v-avatar
						>
						<v-card-text class="overview-copy"
							><strong>Dimensioni esplorate: 3</strong><br /><span
								>(osservazione, organizzazione, ipotesi)</span
							></v-card-text
						>
					</v-sheet>
					<v-sheet class="overview-item pending" color="transparent">
						<v-avatar
							class="status-icon"
							size="29"
							color="transparent"
						/>
						<v-card-text class="overview-copy"
							><strong>Da approfondire: 2</strong><br /><span
								>(condivisione, rete)</span
							></v-card-text
						>
					</v-sheet>
					<v-sheet class="overview-item question" color="transparent">
						<v-avatar
							class="status-icon"
							size="29"
							color="transparent"
							>?</v-avatar
						>
						<v-card-text class="overview-copy"
							><strong>Domanda ancora aperta</strong><br /><span
								>Quali ulteriori evidenze, scolastiche o
								relazionali,<br class="wide-only" />
								possono aiutarti a discriminare tra le
								ipotesi?</span
							></v-card-text
						>
					</v-sheet>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<style scoped lang="scss">
	.metacognitive-panel {
		margin-top: 20px;
		border: 2px solid #dce5fa;
		border-radius: 22px;
		overflow: hidden;
		background: #fff;
		box-shadow: 0 3px 12px #294c9912;
		color: #12245d;
	}

	.panel-header {
		display: flex;
		align-items: center;
		gap: 15px;
		min-height: 70px;
		padding: 8px 32px;
		background: linear-gradient(90deg, #edf2ff, #e6edff 55%, #f3f6ff);
	}

	.header-icon {
		width: 55px;
		height: 55px;
		display: grid;
		place-items: center;
		color: #243fc9;
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
		color: #102b80;
		font-size: 21px;
		font-weight: 800;
	}

	.info-icon {
		display: inline-grid;
		place-items: center;
		width: 22px;
		height: 22px;
		border: 2px solid #5874ca;
		border-radius: 50%;
		color: #3159bf;
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
		border-left: 2px solid #cbd4e8;
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
		color: #102b80;
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
		background: #bcc7dc;
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
		background: #e9ecf2;
		color: #17203e;
		font-size: 17px;
		font-weight: 700;
	}

	.step-marker span {
		font-size: 21px;
	}
	.step.completed .step-marker {
		background: #41b95c;
		color: #fff;
	}
	.step.current .step-marker {
		border: 2px solid #2560d4;
		background: #fff;
		color: #124eba;
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
		background: #e8edff;
	}
	.summary-title span {
		color: #1855c1;
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
		background: #f0f3ff;
		color: #12245d;
		font-size: 13px;
		line-height: 1.42;
		font-weight: 600;
	}

	.overview-title {
		margin-bottom: 10px;
	}
	.target-icon {
		color: #174fc0;
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
		color: #17254d;
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
	.explored .status-icon {
		background: #41b95c;
		color: #fff;
		font-size: 19px;
	}
	.pending .status-icon {
		border: 2px solid #aeb9d2;
	}
	.question .status-icon {
		border: 2px solid #2560d4;
		color: #2560d4;
		font-size: 18px;
		font-weight: 700;
	}

	@media (max-width: 1100px) {
		.overview {
			border-left: 0;
			border-top: 2px solid #cbd4e8;
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
			border-top: 2px solid #cbd4e8;
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

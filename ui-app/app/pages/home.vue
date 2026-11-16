<script setup lang="ts">
	import { storeToRefs } from 'pinia';
	import signInSection from '@/components/signInSection.vue';
	import { useAppStore } from '@/stores/appStore';

	const { isLoggedIn } = storeToRefs(useAppStore());

	definePageMeta({
		layout: 'main-layout',
	});
</script>

<template>
	<v-container fluid class="home-page">
		<section v-if="isLoggedIn" class="simple-page panel">
			<div class="simple-hero">
				<span class="material-symbols-rounded big-icon">home</span>
				<div>
					<p class="eyebrow">PIATTAFORMA INDIRE</p>
					<h1>Benvenuto nella tua area docente</h1>
					<p>
						Riprendi il percorso di riflessione sul disagio
						giovanile e trova rapidamente gli strumenti per
						accompagnare i tuoi studenti.
					</p>
				</div>
			</div>
			<div class="quick-grid">
				<NuxtLink to="/"
					><span class="material-symbols-rounded">forum</span
					><strong>Continua il dialogo</strong
					><small>Riprendi dalla situazione di Marco</small></NuxtLink
				><NuxtLink to="/risorse"
					><span class="material-symbols-rounded">folder_open</span
					><strong>Esplora le risorse</strong
					><small>Materiali consigliati per te</small></NuxtLink
				><NuxtLink to="/percorso-e-learning"
					><span class="material-symbols-rounded">school</span
					><strong>Vai al percorso e-learning</strong
					><small>Le tappe della formazione</small></NuxtLink
				>
			</div>
			<div class="home-section">
				<h2>Il tuo percorso in sintesi</h2>
				<div class="home-progress">
					<div><b>3</b><span>dimensioni esplorate</span></div>
					<div><b>2</b><span>aspetti da approfondire</span></div>
					<div><b>12</b><span>risorse correlate</span></div>
				</div>
			</div>
		</section>
		<section
			v-else
			class="tw:panel tw:flex tw:flex-col tw:items-center tw:justify-center"
		>
			<v-sheet
				color="transparent"
				class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-4 landing-brand"
			>
				<strong
					>Piattaforma INDIRE – Prevenzione delle dipendenze e disagio
					giovanile</strong
				>
				<span>Assistenza metacognitiva per docenti</span>
			</v-sheet>
			<v-sheet class="signin-section-wrapper" color="transparent">
				<signInSection />
			</v-sheet>
		</section>
	</v-container>
</template>

<style scoped lang="scss">
	.signin-section-wrapper {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 32px 16px;
	}

	.simple-page {
		display: flex-row;
	}
	.landing-brand {
		color: inherit;
		text-decoration: none;
	}
	.landing-brand strong {
		display: block;
		color: #102c7f;
		font-size: 25px;
		font-weight: 800;
		line-height: 1.1;
	}
	.landing-brand span {
		display: block;
		margin-top: 6px;
		color: #183274;
		font-size: 17px;
		font-weight: 600;
		line-height: 1.15;
	}
</style>

<script setup lang="ts">
	definePageMeta({
		layout: 'landing-layout',
	});
	import { storeToRefs } from 'pinia';
	import signInSection from '@/components/signInSection.vue';
	import { useAppStore } from '@/stores/appStore';

	const { isLoggedIn } = storeToRefs(useAppStore());
</script>

<template>
	<v-container class="d-flex flex-column justify-center tw:gap-4">
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

		<!-- <h1 class="tw:text-6xl tw:bg-ux1 tw:font-bold tw:text-primary ">
            Benvenuto in Nuxt + Vuetify + Tailwind 4!
        </h1>
        <v-btn color="alex" class="mx-2">
            Un bottone Vuetify con un colore personalizzato
        </v-btn> -->
	</v-container>
</template>

<style lang="scss" scoped>
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

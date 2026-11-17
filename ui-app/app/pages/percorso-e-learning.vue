<script setup lang="ts">
	import { learningPath as steps } from '#shared/data/learning';

	definePageMeta({
		layout: 'main-layout',
	});
</script>

<template>
	<section class="simple-page panel">
		<div class="page-heading">
			<span class="material-symbols-rounded big-icon">school</span>
			<div>
				<p class="eyebrow">FORMAZIONE E ACCOMPAGNAMENTO</p>
				<h1>Percorso e-learning</h1>
				<p>Un itinerario in otto tappe per osservare, interpretare e progettare azioni educative consapevoli.</p>
			</div>
		</div>
		<div class="learning-layout">
			<div class="learning-list">
				<article v-for="step in steps" :key="step.number" class="learning-step" :class="step.state">
					<span class="step-number">
						<span v-if="step.state === 'completed'" class="material-symbols-rounded">check</span>
						<template v-else>{{ step.number }}</template>
					</span>
					<div>
						<h2>Tappa {{ step.number }} - {{ step.title }}</h2>
						<p>{{ step.state === 'completed' ? 'Completata nel tuo percorso' : step.state === 'current' ? 'Tappa attuale - pronta per essere esplorata' : 'Da esplorare' }}</p>
					</div>
					<span class="material-symbols-rounded arrow">chevron_right</span>
				</article>
			</div>
			<aside class="learning-aside">
				<span class="material-symbols-rounded">emoji_objects</span>
				<h2>Il tuo prossimo passo</h2>
				<p>Confronta le tue interpretazioni con le evidenze osservate e prepara il dialogo con la rete educativa.</p>
				<NuxtLink to="/">Riprendi il dialogo <span class="material-symbols-rounded">arrow_forward</span></NuxtLink>
			</aside>
		</div>
	</section>
</template>

<template>
	<v-footer
		class="app-footer d-flex align-center justify-center ga-2 flex-wrap"
		color="surface-light"
	>
		<div class="text-center mt-2">
			{{ new Date().getFullYear() }} <strong>Indire</strong> — Tutti i
			diritti riservati. • Creato con ❤️ [nuxt]
		</div>
	</v-footer>
</template>

<style scoped lang="scss">
	.app-footer {
		width: 100%;
	}

	@media (min-width: 960px) {
		.app-footer {
			height: 48px;
			min-height: 48px;
			max-height: 56px;
			padding: 8px 24px;
		}
	}
</style>

<script setup lang="ts">
	import Footer from '@/components/footer.vue';
</script>
<template>
	<v-app class="landing-layout">
		<v-main>
			<slot />
		</v-main>
		<Footer />
	</v-app>
</template>

<style scoped lang="scss"></style>

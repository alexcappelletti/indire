<script setup lang="ts">
	import Footer from '@/components/footer.vue';
	import { useAppStore } from '@/stores/appStore';
	import { storeToRefs } from 'pinia';

	const appStore = useAppStore();
	const { isLoggedIn } = storeToRefs(appStore);

	async function handleLogout() {
		await appStore.logout();
		await navigateTo('/');
	}
</script>
<template>
	<v-app class="landing-layout">
		<v-main>
			<slot />
		</v-main>
		<Footer />
	</v-app>
</template>

<style scoped lang="scss">
	.landing-bar {
		border-bottom: 1px solid #dce5fa;
		background: #fff !important;
	}
	.landing-bar-inner {
		display: flex;
		align-items: center;
		padding: 0 32px;
	}
	.landing-brand {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		color: #102c7f;
		text-decoration: none;
		min-width: 0;
	}
	.landing-brand strong {
		display: block;
		font-size: 21px;
		line-height: 1.1;
		white-space: normal;
	}
	.landing-brand span {
		display: block;
		margin-top: 4px;
		color: #183274;
		font-size: 14px;
	}
	@media (max-width: 900px) {
		.landing-bar {
			height: auto !important;
			min-height: 76px;
		}
		.landing-bar-inner {
			padding: 8px 16px;
		}
		.landing-brand strong {
			font-size: 16px;
		}
		.landing-brand span {
			font-size: 12px;
		}
	}
</style>

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { useAppStore } from '@/stores/appStore';
	import type { GoogleApi, GoogleCredentialResponse } from '@/types/google';

	declare global {
		interface Window {
			google?: GoogleApi;
		}
	}

	const googleButton = ref<{ $el?: HTMLElement } | HTMLElement | null>(null);
	const errorMessage = ref('');
	const isLoading = ref(false);
	const appStore = useAppStore();
	const runtimeConfig = useRuntimeConfig();

	function loadGoogleScript() {
		return new Promise<void>((resolve, reject) => {
			if (window.google) return resolve();
			const script = document.createElement('script');
			script.src = 'https://accounts.google.com/gsi/client';
			script.async = true;
			script.defer = true;
			script.onload = () => resolve();
			script.onerror = () =>
				reject(
					new Error('Impossibile caricare Google Identity Services'),
				);
			document.head.appendChild(script);
		});
	}

	async function handleGoogleCredential(response: GoogleCredentialResponse) {
		isLoading.value = true;
		errorMessage.value = '';
		try {
			const user = await $fetch('/api/auth/google', {
				method: 'POST',
				body: { credential: response.credential },
			});
			appStore.setAuthUser(user);
			await appStore.loadUserMetacognitivePath();
			await navigateTo('/home');
		} catch (error) {
			errorMessage.value =
				(error as { data?: { statusMessage?: string } })?.data?.statusMessage ||
				(error instanceof Error ? error.message : 'Accesso Google non riuscito.');
		} finally {
			isLoading.value = false;
		}
	}

	onMounted(async () => {
		try {
			const session = await $fetch('/api/auth/me');
			if (session.user) {
				appStore.setAuthUser(session.user);
				await appStore.loadUserMetacognitivePath();
				return;
			}
		} catch {
			// Nessuna sessione attiva: resta visibile il signin.
		}

		if (!runtimeConfig.public.googleClientId) {
			errorMessage.value =
				'Configura GOOGLE_CLIENT_ID per abilitare l’accesso Google.';
			return;
		}
		try {
			await loadGoogleScript();
			if (!googleButton.value || !window.google) return;
			const googleButtonElement =
				googleButton.value instanceof HTMLElement
					? googleButton.value
					: googleButton.value.$el;
			if (!googleButtonElement) return;
			window.google.accounts.id.initialize({
				client_id: runtimeConfig.public.googleClientId,
				callback: handleGoogleCredential,
			});
			window.google.accounts.id.renderButton(googleButtonElement, {
				theme: 'outline',
				size: 'large',
				width: 360,
				text: 'signin_with',
			});
		} catch (error) {
			errorMessage.value =
				error instanceof Error
					? error.message
					: 'Accesso Google non disponibile.';
		}
	});
</script>

<template>
	<v-card class="signin-card" elevation="0">
		<v-card-item>
			<template #prepend
				><v-avatar color="#e8efff" size="54"
					><v-icon color="#1554be" size="28"
						>mdi-login-variant</v-icon
					></v-avatar
				></template
			>
			<v-card-title>Accedi alla piattaforma</v-card-title>
			<v-card-subtitle
				>Accedi alla piattaforma per esplorare gli strumenti e i
				contenuti dedicati ai docenti.</v-card-subtitle
			>
		</v-card-item>
		<v-card-text>
			<v-alert
				v-if="errorMessage"
				type="error"
				variant="tonal"
				class="mb-4"
				>{{ errorMessage }}</v-alert
			>
			<v-progress-linear
				v-if="isLoading"
				indeterminate
				color="#1554be"
				class="mb-4"
			/>
			<v-sheet
				ref="googleButton"
				class="google-button"
				color="transparent"
			/>
		</v-card-text>
	</v-card>
</template>

<style scoped lang="scss">
	.signin-card {
		width: 100%;
		max-width: 430px;
		border: 1px solid $color-border;
		border-radius: $radius-lg;
		background: $color-white;
		box-shadow: $shadow-card;
	}
	.signin-card :deep(.v-card-title) {
		color: $color-navy;
		font-size: $text-lg;
		font-weight: 800;
		white-space: normal;
		overflow-wrap: anywhere;
	}
	.signin-card :deep(.v-card-subtitle) {
		max-width: 100%;
		color: $color-muted;
		line-height: 1.35;
		white-space: normal;
		overflow: visible;
		text-overflow: clip;
		overflow-wrap: anywhere;
	}
	.google-button {
		min-height: 44px;
		display: flex;
		justify-content: center;
	}
</style>

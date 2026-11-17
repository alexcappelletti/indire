<script setup lang="ts">
	import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
	import { mockResources } from '#shared/mocks/resources';
	import type { ResourcesResponse } from '#shared/types/api';
	import type { Resource } from '#shared/types/resources';

	definePageMeta({ layout: 'main-layout' });

	const resources = ref<Resource[]>([]);
	const search = ref('');
	const dateFrom = ref('');
	const dateTo = ref('');
	const page = ref(1);
	const hasMore = ref(true);
	const isLoading = ref(false);
	const errorMessage = ref('');
	const loadMoreTarget = ref<HTMLElement | null>(null);
	let observer: IntersectionObserver | null = null;
	let filterTimer: ReturnType<typeof setTimeout> | undefined;

	function filterMockResources() {
		const normalizedSearch = search.value.trim().toLocaleLowerCase();
		return mockResources.filter((resource) => {
			const textMatches = !normalizedSearch ||
				[resource.title, resource.author, resource.folderPath]
					.filter(Boolean)
					.some((value) => value!.toLocaleLowerCase().includes(normalizedSearch));
			const createdAt = resource.createdAt?.slice(0, 10) || '';
			const fromMatches = !dateFrom.value || createdAt >= dateFrom.value;
			const toMatches = !dateTo.value || createdAt <= dateTo.value;
			return textMatches && fromMatches && toMatches;
		});
	}

	async function loadResources(reset = false) {
		if (isLoading.value || (!reset && !hasMore.value)) return;
		if (reset) {
			page.value = 1;
			hasMore.value = true;
			resources.value = [];
			errorMessage.value = '';
		}

		isLoading.value = true;
		try {
			const response = await $fetch<ResourcesResponse>('/api/resources', {
				query: {
					page: page.value,
					pageSize: 12,
					search: search.value || undefined,
					dateFrom: dateFrom.value || undefined,
					dateTo: dateTo.value || undefined,
				},
			});

			resources.value.push(...response.items);
			hasMore.value = response.hasMore;
			page.value += 1;
		} catch (error) {
			if (page.value === 1) {
				resources.value = filterMockResources();
				hasMore.value = false;
				errorMessage.value = 'Database non disponibile: visualizzati i dati dimostrativi.';
			} else {
				errorMessage.value = error instanceof Error ? error.message : 'Impossibile caricare altre risorse.';
			}
		} finally {
			isLoading.value = false;
		}
	}

	function resetFilters() {
		search.value = '';
		dateFrom.value = '';
		dateTo.value = '';
	}

	function formatDate(value?: string) {
		if (!value) return 'Data non disponibile';
		return new Intl.DateTimeFormat('it-IT', { dateStyle: 'medium' }).format(new Date(value));
	}

	function formatBytes(value?: number) {
		if (!value) return 'Dimensione non disponibile';
		return `${(value / 1024 / 1024).toFixed(1)} MB`;
	}

	function kindLabel(kind: Resource['kind']) {
		return kind === 'presentation' ? 'Presentazione' : 'PDF';
	}

	onMounted(() => {
		loadResources(true);
		observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) loadResources();
			},
			{ rootMargin: '320px' },
		);
		if (loadMoreTarget.value) observer.observe(loadMoreTarget.value);
	});

	onBeforeUnmount(() => {
		observer?.disconnect();
		if (filterTimer) clearTimeout(filterTimer);
	});

	watch([search, dateFrom, dateTo], () => {
		if (filterTimer) clearTimeout(filterTimer);
		filterTimer = setTimeout(() => loadResources(true), 300);
	});
</script>

<template>
	<section class="simple-page panel resources-page">
		<div class="page-heading">
			<span class="material-symbols-rounded big-icon">folder_open</span>
			<div>
				<p class="eyebrow">BIBLIOTECA DELLA PIATTAFORMA</p>
				<h1>Risorse</h1>
				<p>Materiali, guide e approfondimenti per sostenere la prevenzione e la lettura professionale del disagio giovanile.</p>
			</div>
		</div>

		<div class="resources-filters" aria-label="Filtri risorse">
			<v-text-field
				v-model="search"
				label="Cerca nel titolo, autore o cartella"
				placeholder="Scrivi per filtrare..."
				prepend-inner-icon="mdi-magnify"
				variant="outlined"
				clearable
				hide-details
			/>
			<v-text-field v-model="dateFrom" label="Inserite dal" type="date" variant="outlined" hide-details />
			<v-text-field v-model="dateTo" label="Inserite fino al" type="date" variant="outlined" hide-details />
			<v-btn variant="text" prepend-icon="mdi-filter-off" @click="resetFilters">Azzera</v-btn>
		</div>

		<v-alert v-if="errorMessage" type="info" variant="tonal" class="mb-4">
			{{ errorMessage }}
		</v-alert>

		<div v-if="!resources.length && isLoading" class="resources-state">
			<v-progress-circular indeterminate color="primary" />
			<span>Caricamento risorse...</span>
		</div>
		<div v-else-if="!resources.length" class="resources-state">
			<v-icon size="40" color="primary">mdi-folder-search-outline</v-icon>
			<strong>Nessuna risorsa trovata</strong>
			<span>Prova a modificare il testo o l'intervallo di date.</span>
		</div>

		<div v-else class="resource-cards">
			<article v-for="resource in resources" :key="resource.id" class="resource-card">
				<div class="card-top">
					<v-icon color="error" size="32">mdi-file-pdf-box</v-icon>
					<v-chip size="small" color="primary" variant="tonal">{{ kindLabel(resource.kind) }}</v-chip>
				</div>
				<h2>{{ resource.title }}</h2>
				<p class="resource-author">{{ resource.author }}</p>
				<div class="resource-details">
					<span><v-icon size="16">mdi-calendar-outline</v-icon>{{ formatDate(resource.createdAt) }}</span>
					<span><v-icon size="16">mdi-folder-outline</v-icon>{{ resource.folderPath || 'Risorse' }}</span>
					<span><v-icon size="16">mdi-file-document-outline</v-icon>{{ formatBytes(resource.sizeBytes) }}</span>
				</div>
				<div class="resource-card-footer">
					<span class="tag">{{ resource.relevance }}% pertinente</span>
					<v-btn
						:href="resource.url"
						:disabled="!resource.url"
						variant="text"
						color="primary"
						append-icon="mdi-open-in-new"
					>
						Apri risorsa
					</v-btn>
				</div>
			</article>
		</div>

		<div ref="loadMoreTarget" class="load-more-state" aria-live="polite">
			<v-progress-circular v-if="isLoading && resources.length" indeterminate size="24" color="primary" />
			<span v-else-if="!hasMore && resources.length">Hai visualizzato tutte le risorse.</span>
		</div>
	</section>
</template>

<style scoped lang="scss">
	.resources-page {
		padding-bottom: 32px;
	}

	.resources-filters {
		display: grid;
		grid-template-columns: minmax(280px, 1fr) 180px 180px auto;
		align-items: center;
		gap: 12px;
		margin: 24px 0;
	}

	.resource-cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 18px;
	}

	.resource-card {
		display: flex;
		flex-direction: column;
		min-height: 238px;
		padding: 20px;
		border: 1px solid #dce5fa;
		border-radius: 18px;
		background: #fff;
		box-shadow: 0 8px 24px rgba(41, 76, 153, 0.08);
	}

	.card-top,
	.resource-card-footer,
	.resource-details span {
		display: flex;
		align-items: center;
	}

	.card-top,
	.resource-card-footer {
		justify-content: space-between;
		gap: 12px;
	}

	.resource-card h2 {
		margin: 18px 0 8px;
		color: #102c7f;
		font-size: 18px;
		line-height: 1.25;
	}

	.resource-author {
		color: #526384;
		font-size: 14px;
	}

	.resource-details {
		display: flex;
		flex-direction: column;
		gap: 5px;
		margin: 16px 0;
		color: #526384;
		font-size: 12px;
	}

	.resource-details span {
		gap: 6px;
	}

	.resource-card-footer {
		margin-top: auto;
		border-top: 1px solid #eef1f7;
		padding-top: 10px;
	}

	.tag {
		color: #1554be;
		font-size: 12px;
		font-weight: 700;
	}

	.resources-state,
	.load-more-state {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		min-height: 120px;
		color: #526384;
		text-align: center;
	}

	.load-more-state {
		min-height: 76px;
		font-size: 13px;
	}

	@media (max-width: 800px) {
		.resources-filters {
			grid-template-columns: 1fr;
		}
	}
</style>

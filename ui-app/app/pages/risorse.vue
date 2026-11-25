<script setup lang="ts">
	import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
	import { useElementSize } from '@vueuse/core';
	import { resourcesMock } from '#shared/mocks/resourcesMock';
	import type { ResourcesResponse } from '#shared/types/api';
	import type { Resource } from '#shared/types/resources';

	definePageMeta({ layout: 'main-layout' });

	const resources = ref<Resource[]>([]);
	const resourceContentRef = ref<HTMLElement | null>(null);
	const { width: contentWidth, height: contentHeight } =
		useElementSize(resourceContentRef);
	const search = ref('');
	const dateFrom = ref('');
	const dateTo = ref('');
	const total = ref(0);
	const page = ref(1);
	const pageSize = computed(() => {
		const cardWidth = 280;
		const cardHeight = 280;
		const gap = 18;
		const columns = Math.max(
			1,
			Math.floor((contentWidth.value + gap) / (cardWidth + gap)),
		);
		const rows = Math.max(
			1,
			Math.floor((contentHeight.value + gap) / (cardHeight + gap)),
		);

		return Math.min(50, columns * rows);
	});
	const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)));
	const sortBy = ref<'title' | 'createdAt'>('title');
	const sortOrder = ref<'asc' | 'desc'>('asc');
	const isLoading = ref(false);
	const errorMessage = ref('');
	const isMounted = ref(false);
	let filterTimer: ReturnType<typeof setTimeout> | undefined;
	const sortLabel = computed(() => {
		if (sortBy.value === 'title') {
			return sortOrder.value === 'asc' ? 'Titolo A-Z' : 'Titolo Z-A';
		}
		return sortOrder.value === 'asc' ? 'Data meno recente' : 'Data più recente';
	});

	const sortOptions = [
		{ label: 'Titolo A-Z', sortBy: 'title', sortOrder: 'asc' },
		{ label: 'Titolo Z-A', sortBy: 'title', sortOrder: 'desc' },
		{ label: 'Data meno recente', sortBy: 'createdAt', sortOrder: 'asc' },
		{ label: 'Data più recente', sortBy: 'createdAt', sortOrder: 'desc' },
	] as const;

	function filterMockResources() {
		const normalizedSearch = search.value.trim().toLocaleLowerCase();
		return resourcesMock.filter((resource) => {
			const textMatches =
				!normalizedSearch ||
				[resource.title, resource.author, resource.folderPath]
					.filter(Boolean)
					.some((value) =>
						value!.toLocaleLowerCase().includes(normalizedSearch),
					);
			const createdAt = resource.createdAt?.slice(0, 10) || '';
			const fromMatches = !dateFrom.value || createdAt >= dateFrom.value;
			const toMatches = !dateTo.value || createdAt <= dateTo.value;
			return textMatches && fromMatches && toMatches;
		});
	}

	async function loadResources(targetPage = 1) {
		if (isLoading.value) return;
		if (targetPage < 1 || targetPage > pageCount.value) return;

		page.value = targetPage;
		resources.value = [];
		errorMessage.value = '';

		isLoading.value = true;
		try {
			const response = await $fetch<ResourcesResponse>('/api/resources', {
				query: {
					page: page.value,
					pageSize: pageSize.value,
					search: search.value || undefined,
					dateFrom: dateFrom.value || undefined,
					dateTo: dateTo.value || undefined,
					sortBy: sortBy.value,
					sortOrder: sortOrder.value,
				},
			});

			resources.value = response.items;
			total.value = response.total;
		} catch (error) {
			if (!resources.value.length) {
				const filteredResources = filterMockResources();
				total.value = filteredResources.length;
				resources.value = filteredResources.slice(
					(page.value - 1) * pageSize.value,
					page.value * pageSize.value,
				);
				errorMessage.value =
					'Database non disponibile: visualizzati i dati dimostrativi.';
			} else {
				errorMessage.value =
					error instanceof Error ? error.message : 'Impossibile caricare le risorse.';
			}
		} finally {
			isLoading.value = false;
		}
	}

	function applySort(nextSortBy: 'title' | 'createdAt', nextSortOrder: 'asc' | 'desc') {
		sortBy.value = nextSortBy;
		sortOrder.value = nextSortOrder;
		loadResources(1);
	}

	function resetFilters() {
		search.value = '';
		dateFrom.value = '';
		dateTo.value = '';
	}

	function formatDate(value?: string) {
		if (!value) return 'Data non disponibile';
		return new Intl.DateTimeFormat('it-IT', { dateStyle: 'medium' }).format(
			new Date(value),
		);
	}

	function formatBytes(value?: number) {
		if (!value) return 'Dimensione non disponibile';
		return `${(value / 1024 / 1024).toFixed(1)} MB`;
	}

	function kindLabel(kind: Resource['kind']) {
		return kind === 'presentation' ? 'Presentazione' : 'PDF';
	}

	onMounted(() => {
		isMounted.value = true;
		loadResources(1);
	});

	onBeforeUnmount(() => {
		if (filterTimer) clearTimeout(filterTimer);
	});

	watch([search, dateFrom, dateTo], () => {
		if (filterTimer) clearTimeout(filterTimer);
			filterTimer = setTimeout(() => loadResources(1), 300);
	});

	watch(pageSize, (nextPageSize, previousPageSize) => {
		if (isMounted.value && nextPageSize !== previousPageSize) {
			loadResources(1);
		}
	});
</script>

<template>
	<section class="simple-page panel resources-page">
		<div class="page-heading">
			<span class="material-symbols-rounded big-icon">folder_open</span>
			<div>
				<p class="eyebrow">BIBLIOTECA DELLA PIATTAFORMA</p>
				<h1>Risorse</h1>
				<p>
					Materiali, guide e approfondimenti per sostenere la
					prevenzione e la lettura professionale del disagio
					giovanile.
				</p>
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
			<v-text-field
				v-model="dateFrom"
				label="Inserite dal"
				type="date"
				variant="outlined"
				hide-details
			/>
			<v-text-field
				v-model="dateTo"
				label="Inserite fino al"
				type="date"
				variant="outlined"
				hide-details
			/>
			<v-btn
				variant="text"
				prepend-icon="mdi-filter-off"
				@click="resetFilters"
				>Azzera</v-btn
			>
			<v-menu location="bottom end">
				<template #activator="{ props }">
					<v-chip
						v-bind="props"
						class="sort-chip"
						color="primary"
						variant="tonal"
						prepend-icon="mdi-sort"
					>
						Ordina: {{ sortLabel }}
					</v-chip>
				</template>
				<v-list density="compact">
					<v-list-item
						v-for="option in sortOptions"
						:key="option.label"
						:active="option.label === sortLabel"
						@click="applySort(option.sortBy, option.sortOrder)"
					>
						<v-list-item-title>{{ option.label }}</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</div>

		<v-alert v-if="errorMessage" type="info" variant="tonal" class="mb-4">
			{{ errorMessage }}
		</v-alert>

		<div ref="resourceContentRef" class="resource-content-scroll">
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
			<article
				v-for="resource in resources"
				:key="resource.id"
				class="resource-card"
			>
				<div class="card-top">
					<v-icon color="error" size="32">mdi-file-pdf-box</v-icon>
					<v-chip size="small" color="primary" variant="tonal">{{
						kindLabel(resource.kind)
					}}</v-chip>
				</div>
				<h2>{{ resource.title }}</h2>
				<p class="resource-author">{{ resource.author }}</p>
				<div class="resource-details">
					<span
						><v-icon size="16">mdi-calendar-outline</v-icon
						>{{ formatDate(resource.createdAt) }}</span
					>
					<span
						><v-icon size="16">mdi-folder-outline</v-icon
						>{{ resource.folderPath || 'Risorse' }}</span
					>
					<span
						><v-icon size="16">mdi-file-document-outline</v-icon
						>{{ formatBytes(resource.sizeBytes) }}</span
					>
				</div>
				<div class="resource-card-footer">
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

		<div class="load-more-state" aria-live="polite">
			<v-progress-circular
				v-if="isLoading"
				indeterminate
				size="24"
				color="primary"
			/>
		</div>
		</div>

		<div v-if="pageCount > 1" class="resources-pagination">
			<v-pagination
				v-model="page"
				:length="pageCount"
				:disabled="isLoading"
				:total-visible="7"
				@update:model-value="loadResources"
			/>
		</div>
	</section>
</template>

<style scoped lang="scss">
	.resources-page {
		width: 100%;
		max-width: none;
		height: calc(100vh - 88px);
		min-height: calc(100vh - 88px);
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		padding: 28px clamp(24px, 4vw, 64px) 32px;
	}

	.resource-content-scroll {
		min-height: 0;
		flex: 1 1 auto;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 0 8px 12px 0;
	}

	.resources-filters {
		display: grid;
		grid-template-columns: minmax(280px, 1fr) 180px 180px auto;
		align-items: center;
		gap: 12px;
		margin: 24px 0;
	}

	.resource-cards {
		width: 100%;
		flex: 1 1 auto;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
		gap: 18px;
		align-content: start;
		align-items: start;
	}

	.resource-card {
		display: flex;
		flex-direction: column;
		height: 280px;
		min-height: 280px;
		width: 100%;
		max-width: 100%;
		justify-self: stretch;
		padding: 16px;
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
		width: 100%;
		height: 45px;
		min-height: 45px;
		flex: 0 0 45px;
		margin: 18px 0 8px;
		color: #102c7f;
		font-size: 18px;
		line-height: 1.25;
		white-space: normal;
		overflow-wrap: anywhere;
		word-break: break-word;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
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

	.resources-pagination {
		flex: 0 0 auto;
		display: flex;
		justify-content: center;
		padding: 8px 0 0;
	}

	@media (max-width: 800px) {
		.resources-filters {
			grid-template-columns: 1fr;
		}

		.resource-cards {
			grid-template-columns: 1fr;
		}

		.resource-card {
			width: 100%;
		}
	}

</style>

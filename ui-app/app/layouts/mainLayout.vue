<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const navigation = [
	{ label: 'Home', to: '/home', icon: 'home' },
	{ label: 'Agente conversazionale', to: '/conversationPage', icon: 'forum' },
	{ label: 'Percorso e-learning', to: '/percorso-e-learning', icon: 'menu_book' },
	{ label: 'Risorse', to: '/risorse', icon: 'folder_open' },
]

function isActive(path: string) {
	return route.path === path
}
</script>

<template>
	<v-app class="main-layout">
		<v-app-bar class="main-app-bar" elevation="0" height="88">
			<div class="app-bar-inner">
				<NuxtLink to="/conversationPage" class="brand-link" aria-label="Torna all'agente conversazionale">
					<div class="brain-mark">🧠</div>
					<div class="brand-copy">
						<div class="brand-title">Piattaforma INDIRE – Prevenzione delle dipendenze e disagio giovanile</div>
						<div class="brand-subtitle">Assistenza metacognitiva per docenti</div>
					</div>
				</NuxtLink>

				<nav class="main-nav" aria-label="Navigazione principale">
					<NuxtLink
						v-for="item in navigation"
						:key="item.to"
						:to="item.to"
						class="nav-link"
						:class="{ active: isActive(item.to) }"
					>
						<span class="material-symbols-rounded nav-icon">{{ item.icon }}</span>
						<span>{{ item.label }}</span>
					</NuxtLink>
					<button class="profile-button" aria-label="Profilo">
						<span class="material-symbols-rounded">person</span>
					</button>
				</nav>
			</div>
		</v-app-bar>

		<v-main>
			<slot>
				<p class="empty-slot">Slot del layout non ricevuto.</p>
			</slot>
		</v-main>
	</v-app>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400,0,0');

.main-layout {
		background: #fff;
		color: #13214d;
}

.main-app-bar {
		background: #fff !important;
		border-bottom: 1px solid #d9e2f6;
		color: #102467 !important;
}

.app-bar-inner {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 28px;
		padding: 0 31px 0 38px;
}

.brand-link {
		display: flex;
		align-items: center;
		gap: 15px;
		min-width: 0;
		color: inherit;
		text-decoration: none;
}

.brain-mark {
		width: 82px;
		height: 70px;
		display: grid;
		place-items: center;
		flex: 0 0 auto;
		font-size: 48px;
		border-radius: 50%;
		background: radial-gradient(circle, #ffd4ff 0, #cbeaff 48%, transparent 72%);
}

.brand-copy {
		min-width: 0;
}

.brand-title {
		color: #0d2d80;
		font-size: 18px;
		font-weight: 800;
		line-height: 1.15;
		white-space: nowrap;
}

.brand-subtitle {
		margin-top: 5px;
		color: #183274;
		font-size: 13px;
		font-weight: 600;
	}

.main-nav {
		display: flex;
		align-items: center;
		gap: 7px;
		flex: 0 0 auto;
}

.nav-link {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 11px 14px;
		border-radius: 15px;
		color: #102467;
		font-size: 13px;
		font-weight: 700;
		text-decoration: none;
		white-space: nowrap;
		transition: background .2s ease, box-shadow .2s ease;
}

.nav-link:hover,
.nav-link.active {
		background: #e9eeff;
		box-shadow: 0 3px 10px #c2d0f555;
}

.material-symbols-rounded {
		font-family: 'Material Symbols Rounded';
		font-weight: normal;
		font-style: normal;
		font-size: 25px;
		line-height: 1;
		letter-spacing: normal;
		text-transform: none;
		display: inline-block;
		white-space: nowrap;
		direction: ltr;
		-webkit-font-feature-settings: 'liga';
		-webkit-font-smoothing: antialiased;
}

.profile-button {
		width: 54px;
		height: 43px;
		margin-left: 6px;
		border: 0;
		border-left: 2px solid #e6eaff;
		background: transparent;
		color: #0d3d98;
		font-size: 28px;
	}

.empty-slot {
		padding: 24px;
}

@media (max-width: 1250px) {
	.main-app-bar {
			height: auto !important;
			min-height: 88px;
		}

	.app-bar-inner {
			padding: 10px 20px;
			flex-wrap: wrap;
		}

	.brand-title {
			font-size: 18px;
		}

	.brand-subtitle {
			font-size: 14px;
		}

	.main-nav {
			margin-left: auto;
			overflow-x: auto;
		}
}

@media (max-width: 700px) {
	.app-bar-inner {
			align-items: flex-start;
			gap: 8px;
		}

	.brain-mark {
			width: 58px;
			height: 52px;
			font-size: 35px;
		}

	.brand-title {
			font-size: 15px;
			white-space: normal;
		}

	.brand-subtitle {
			font-size: 12px;
		}

	.main-nav {
			width: 100%;
			margin-left: 0;
		}

	.nav-link {
			padding: 8px;
			font-size: 0;
		}

	.nav-link .material-symbols-rounded {
			font-size: 23px;
		}

	.profile-button {
			margin-left: auto;
		}
}
</style>

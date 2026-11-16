// https://nuxt.com/docs/api/configuration/nuxt-config

import { resolve } from 'path';

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	alias: {
		'#': resolve(__dirname, '.'),
		'@': resolve(__dirname, 'app'),
		'~': resolve(__dirname, 'app'),
	},

	modules: ['@vueuse/nuxt', '@pinia/nuxt', 'vuetify-nuxt-module'],

	css: ['vuetify/styles', '~/assets/css/tailwind.css'],

	runtimeConfig: {
		sessionSecret: process.env.SESSION_SECRET || '',
		mongoUri: process.env.MONGODB_URI || '',
		mongoDbName: process.env.MONGODB_DB_NAME || '',
		public: {
			googleClientId: process.env.GOOGLE_CLIENT_ID || '',
		},
	},

	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use "~/assets/scss/variables" as *;',
				},
			},
		},
		resolve: {
			alias: {
				'#': resolve(__dirname, '.'),
				'@': resolve(__dirname, 'app'),
				'~': resolve(__dirname, 'app'),
			},
		},

		server: {
			watch: {
				usePolling: true,
				interval: 100,
			},
		},
	},

	postcss: {
		plugins: {
			'@tailwindcss/postcss': {},
			autoprefixer: {},
		},
	},

	vuetify: {
		moduleOptions: {
			prefixComposables: true,
		},
		vuetifyOptions: {
			theme: {
				defaultTheme: 'light',
				themes: {
					light: {
						colors: {
							background: '#ffffff',
							surface: '#ffffff',
							primary: '#1455c1',
							secondary: '#424242',
							info: '#2868d5',
							success: '#43ab5c',
							warning: '#f4c12f',
							error: '#d93b3b',
							alex: '#aa77b6',
							ux1: '#c6d0ff',
						},
					},
				},
			},
		},
	},
});

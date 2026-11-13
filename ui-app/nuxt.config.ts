// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },

	modules: [
		'@vueuse/nuxt',
		'@pinia/nuxt',
		'vuetify-nuxt-module',
	],

	css: [
		'vuetify/styles',
		'~/assets/css/tailwind.css',
	],

	vite: {
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
})

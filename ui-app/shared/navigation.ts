import type { NavigationItem } from '#shared/types/navigation';

export const mainNavigation: NavigationItem[] = [
	{ label: 'Home', to: '/home', icon: 'home' },
	{ label: 'Agente conversazionale', to: '/conversationPage', icon: 'forum' },
	{ label: 'Percorso e-learning', to: '/percorso-e-learning', icon: 'menu_book' },
	{ label: 'Risorse', to: '/risorse', icon: 'folder_open' },
];

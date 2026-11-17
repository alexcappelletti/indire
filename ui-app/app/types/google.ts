export type GoogleCredentialResponse = { credential: string };

export type GoogleApi = {
	accounts: {
		id: {
			initialize: (config: {
				client_id: string;
				callback: (response: GoogleCredentialResponse) => void;
			}) => void;
			renderButton: (
				element: HTMLElement,
				options: Record<string, unknown>,
			) => void;
		};
	};
};

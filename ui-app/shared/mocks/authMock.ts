import type { AuthUser } from '#shared/types/auth';

export const authUserMock: AuthUser = {
	userId: 'mock-authorized-user-001',
	sub: 'mock-user-001',
	name: 'Docente Demo',
	email: 'docente.demo@example.test',
	picture: undefined,
};

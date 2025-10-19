// types.ts
export type RootState = {
	auth: {
		user: {
			id: number;
			email: string;
			name: string;
			role_id: number;
			isActive: boolean;
			createdAt: string; // ISO date string
			updatedAt: string; // ISO date string
		} | null;
		token: string | null;
		sessionId: number | null;
		isAuthenticated: boolean;
	};
};

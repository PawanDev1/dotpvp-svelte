import { writable } from 'svelte/store';

export interface User {
	referralCode?: string;
	referrals?: number;
	referralEarnings?: number;
	multiplier?: number;
	[key: string]: any;
}

function createUserStore() {
	const { subscribe, set, update } = writable<User | null>(null);

	return {
		subscribe,
		set,
		update,
		// Initialize with default user for development
		reset: () => set(null)
	};
}

export const userStore = createUserStore();

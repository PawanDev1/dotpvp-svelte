<script lang="ts">
	import { onMount } from 'svelte';
	import Sol from './icons/Sol.svelte';
	import NoData from './NoData.svelte';

	interface RewardItem {
		_id: string;
		playerId?: {
			name: string;
		};
		finalStatus: string;
		amount: number;
		createdAt: string;
	}

	// Dummy data generator
	function generateDummyData(page: number): RewardItem[] {
		const statuses = ['WIN', 'LOSE', 'DRAW'];
		const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
		const items: RewardItem[] = [];

		for (let i = 0; i < 10; i++) {
			const index = (page - 1) * 10 + i;
			const hoursAgo = index % 24;
			const daysAgo = Math.floor(index / 24);
			const createdAt = new Date();
			createdAt.setHours(createdAt.getHours() - hoursAgo);
			createdAt.setDate(createdAt.getDate() - daysAgo);

			items.push({
				_id: `dummy-${page}-${i}`,
				playerId: {
					name: names[Math.floor(Math.random() * names.length)]
				},
				finalStatus: statuses[Math.floor(Math.random() * statuses.length)],
				amount: Math.random() * 10 + 0.1,
				createdAt: createdAt.toISOString()
			});
		}

		return items;
	}

	// Simple fromNow function to replace moment.js
	function fromNow(dateString: string): string {
		const now = new Date();
		const date = new Date(dateString);
		const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (diffInSeconds < 60) {
			return 'just now';
		}

		const diffInMinutes = Math.floor(diffInSeconds / 60);
		if (diffInMinutes < 60) {
			return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
		}

		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24) {
			return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
		}

		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays < 7) {
			return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
		}

		const diffInWeeks = Math.floor(diffInDays / 7);
		if (diffInWeeks < 4) {
			return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
		}

		const diffInMonths = Math.floor(diffInDays / 30);
		return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
	}

	let activities = $state<RewardItem[]>([]);
	let currentPage = $state(1);
	let totalPages = $state(5); // Simulate 5 pages of dummy data
	let loading = $state(false);
	let isConnected = $state(true);
	let containerRef = $state<HTMLDivElement | null>(null);
	let isFetchingRef = $state(false);

	function fetchActivity(page: number, direction: 'up' | 'down') {
		if (isFetchingRef) return;
		isFetchingRef = true;
		loading = true;

		// Simulate API call with setTimeout
		setTimeout(() => {
			try {
				const fetched = generateDummyData(page);
				currentPage = page;
				// Update activities based on direction
				const existingIds = new Set(activities.map((item) => item._id));
				const newItems = fetched.filter((item) => !existingIds.has(item._id));

				if (direction === 'down') {
					activities = [...activities, ...newItems];
				} else {
					activities = [...newItems, ...activities];
				}
			} catch (err) {
				console.error('Failed to fetch:', err);
			} finally {
				loading = false;
				isFetchingRef = false;
			}
		}, 300); // Simulate network delay
	}

	function handleScroll(event: Event) {
		const target = event.currentTarget as HTMLDivElement;
		if (!target) return;

		const { scrollTop, scrollHeight, clientHeight } = target;

		// Scroll to top: load previous
		if (scrollTop === 0 && currentPage > 1) {
			fetchActivity(currentPage - 1, 'up');
			// Scroll to bottom after adding items at top
			setTimeout(() => {
				if (target) {
					const newScrollHeight = target.scrollHeight;
					target.scrollTop = newScrollHeight - scrollHeight;
				}
			}, 100);
		}

		// Scroll to bottom: load next
		if (scrollTop + clientHeight >= scrollHeight - 10 && currentPage < totalPages) {
			fetchActivity(currentPage + 1, 'down');
		}
	}

	onMount(() => {
		fetchActivity(1, 'down');
	});
</script>

<div
	class="mx-[1.06vw] mr-[2.35vw] grid grid-cols-4 px-[0.47vw] pt-[0.82vw] pb-[0.35vw] text-[0.82vw] font-bold text-white"
>
	<div class="-ml-[0.24vw] text-left">User</div>
	<div class="pr-[2.35vw] text-right">Action</div>
	<div class="pr-[1.65vw] text-right">Amount</div>
	<div class="text-right">Time</div>
</div>

{#if activities.length > 0}
	<div
		bind:this={containerRef}
		class="activity-scroll relative z-10 mr-[1.18vw] max-h-[10.71vw] overflow-y-scroll"
		onscroll={handleScroll}
	>
		{#each activities as item, index (item._id)}
			<div
				class="grid w-full grid-cols-4 py-[0.41vw] pr-[1.18vw] pl-[1.18vw] text-[0.71vw] font-medium"
			>
				<div class="text-left text-[#F6F6F6]">
					{item.playerId?.name || 'N/A'}
				</div>
				<div class="pr-[2.35vw] text-right text-[#FFEF00] uppercase">
					{item.finalStatus}
				</div>
				<div class="flex items-center justify-end gap-[0.24vw] pr-[1.65vw] text-[#F6F6F6]">
					{(Math.floor((item.amount || 0) * 1000) / 1000).toFixed(3)}
				</div>
				<div class="text-right text-[#F6F6F6]">
					{fromNow(item.createdAt)}
				</div>
			</div>
		{/each}
	</div>
{:else if loading}
	<div class="flex h-[10.59vw] animate-pulse flex-col justify-center gap-[0.94vw] px-[0.94vw]">
		{#each Array(5) as _, idx}
			<div class="grid w-full grid-cols-4 gap-[1.41vw]">
				<div class="h-[0.94vw] rounded bg-[#4F4888]"></div>
				<div class="h-[0.94vw] rounded bg-[#4F4888]"></div>
				<div class="h-[0.94vw] rounded bg-[#4F4888]"></div>
				<div class="h-[0.94vw] rounded bg-[#4F4888]"></div>
			</div>
		{/each}
	</div>
{:else}
	<NoData message="No Activity yet!" {isConnected} />
{/if}

<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ActivityIcon from './icons/ActivityIcon.svelte';
	import GameIcon from './icons/GameIcon.svelte';
	import StatsIcon from './icons/StatsIcon.svelte';
	import InfoIcon from './icons/InfoIcon.svelte';
	import GamesHistory from './GamesHistory.svelte';
	import ListActivity from './ListActivity.svelte';
	import PlayerStatsInfo from './PlayerStatsInfo.svelte';
	import Referrals from './Referrals.svelte';

	type Tab = 'Referrals' | 'Activity' | 'Games' | 'Stats';

	const TABS: Array<{ name: Tab; icon: typeof ActivityIcon }> = [
		{ name: 'Referrals', icon: GameIcon },
		{ name: 'Activity', icon: ActivityIcon },
		{ name: 'Games', icon: GameIcon },
		{ name: 'Stats', icon: StatsIcon }
	];

	let activeTab: Tab = $state('Referrals');
	let scale = $state(1);
	let showTooltip = $state(false);
	let connected = $state(false);

	// Handle search params for tab navigation
	$effect(() => {
		const tabParam = $page.url.searchParams.get('tab');
		if (tabParam?.toLowerCase() === 'games') {
			activeTab = 'Games';
			// Keep the Games tab active longer when returning from game
			setTimeout(() => {
				goto('/', { replaceState: true, noScroll: true });
			}, 2000);
		}
	});

	onMount(() => {
		const updateScale = () => {
			const widthScale = window.innerWidth / 1700;
			const heightScale = window.innerHeight / 950;
			scale = Math.min(widthScale, heightScale);
		};
		updateScale();
		window.addEventListener('resize', updateScale);
		return () => {
			window.removeEventListener('resize', updateScale);
		};
	});

	function handleTabClick(tab: Tab) {
		activeTab = tab;
		if (tab !== 'Games') {
			goto('/', { replaceState: true, noScroll: true });
		}
	}

	function handlePlayNow() {
		connected = true;
	}
</script>

<div class="relative h-[50%] max-h-[20vw] min-h-0 shrink p-[0.29vw]">
	<img
		src="https://quest-csv-images.s3.ca-central-1.amazonaws.com/dotpvp-dev/statsandfeed-bg-min.png"
		class="absolute top-0 left-0 h-full w-full"
		alt="bg"
		width="479"
		height="127"
	/>

	<div
		style="clip-path: polygon(1% 0, 99% 0, 100% 14%, 100% 100%, 0 100%, 0 13%)"
		class="flex h-[2.76vw] items-center justify-between bg-[#33203A] px-[1.18vw] py-[0.71vw] pr-[1vw]"
	>
		<h2 class="flex items-center gap-[0.47vw] font-bold text-[#F6F6F6]">
			Stats and Feed
			<!-- <div
				class="relative cursor-pointer"
				role="button"
				tabindex="0"
				onmouseenter={() => (showTooltip = true)}
				onmouseleave={() => (showTooltip = false)}
			>
				<InfoIcon />
				{#if showTooltip}
					{@const tooltipScale = scale + 0.4}
					<div
						class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-[0.24vw] max-w-[10.59vw] -translate-x-1/2 px-[0.71vw] py-[0.35vw] text-[0.47vw] text-white"
						style="background: url(https://quest-csv-images.s3.ca-central-1.amazonaws.com/dotpvp-dev/fe_assets/tooltip-bg.png); background-size: 100% 100%; background-position: center; background-repeat: no-repeat; transform: scale({tooltipScale}); transform-origin: bottom;"
					>
						Toggle between your battle history, game wins, referral scores, and live action — all in
						one power panel.
						<div
							class="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-t-[0.94vw] border-r-[0.94vw] border-l-[0.94vw] border-transparent border-t-[#C2B7F3]"
						></div>
					</div>
				{/if}
			</div> -->
		</h2>
		<div class="flex items-end gap-[0.47vw] text-[0.82vw]">
			{#each TABS as tab}
				{@const isActive = activeTab === tab.name}
				<button
					onclick={() => handleTabClick(tab.name)}
					class="relative flex gap-[0.24vw] px-[0.71vw] py-[0.24vw] text-[0.71vw] capitalize {isActive
						? 'rounded-[0.12vw] border border-[#FFEF00] bg-[linear-gradient(34deg,rgba(32,19,53,0.13)_14.13%,rgba(85,42,152,0.13)_47.4%,rgba(208,188,245,0.13)_73.78%)] font-bold tracking-normal text-[#FFEF00] shadow-[0_0_0.47vw_0_rgba(255,239,0,0.50)]'
						: 'text-[#D1D0D0]'}"
				>
					{tab.name}
				</button>
			{/each}
		</div>
	</div>

	{#if activeTab === 'Activity'}
		<ListActivity />
	{/if}
	<!-- {#if activeTab === 'Games'}
		<GamesHistory />
	{/if}
	{#if activeTab === 'Stats'}
		<PlayerStatsInfo onPlayNow={handlePlayNow} />
	{/if} -->
	{#if activeTab === 'Referrals'}
		<Referrals />
	{/if}
</div>

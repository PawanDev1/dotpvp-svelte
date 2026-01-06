<script lang="ts">
	import StartIcon from './icons/StartIcon.svelte';
	import { onMount } from 'svelte';

	type TabType = '1D' | '7D' | '1M';

	interface LeaderboardEntry {
		name: string;
		winnings: number;
	}

	const data: Record<TabType, LeaderboardEntry[]> = {
		'1D': [
			{ name: 'Acie', winnings: 20.45 },
			{ name: 'Belle', winnings: 18.12 }
		],
		'7D': [
			{ name: 'Acie', winnings: 85.12 },
			{ name: 'Belle', winnings: 73.45 },
			{ name: 'Cyrus', winnings: 85.12 },
			{ name: 'Diana', winnings: 61.78 },
			{ name: 'Elias', winnings: 50.32 },
			{ name: 'Fiona', winnings: 30.15 },
			{ name: 'Josh', winnings: 50.32 }
			// { name: 'KC_montero', winnings: 30.15 },
			// { name: 'KC_montero', winnings: 30.15 }
			// { name: 'KC_montero', winnings: 30.15 }
		],
		'1M': [
			{ name: 'Diana', winnings: 150.45 },
			{ name: 'Elias', winnings: 143.32 }
		]
	};

	let activeTab: TabType = $state('7D');
	let currentSlide = $state(0);
	let autoPlayInterval: ReturnType<typeof setInterval> | null = null;

	const entries = $derived(data[activeTab]);
	const slides = Array(4).fill(null);

	function setActiveTab(tab: TabType) {
		activeTab = tab;
	}

	function getRankIcon(rank: number) {
		if (rank === 1) {
			return { fill: '#FDC700' };
		}
		if (rank === 2) {
			return { fill: '#D1D5DC' };
		}
		if (rank === 3) {
			return { fill: '#E17100' };
		}
		return null;
	}

	function nextSlide() {
		currentSlide = (currentSlide + 1) % slides.length;
	}

	function goToSlide(index: number) {
		currentSlide = index;
	}

	onMount(() => {
		autoPlayInterval = setInterval(() => {
			nextSlide();
		}, 3000);

		return () => {
			if (autoPlayInterval) {
				clearInterval(autoPlayInterval);
			}
		};
	});
</script>

<div class=" h-full w-full p-[5px] pt-2">
	<div class="h-[315px]">
		<!-- Header -->
		<div
			style="clip-path: polygon(2% 0, 100% 0, 100% 100%, 0 100%, 0 14%)"
			class="flex items-center justify-between bg-[#4F488880] px-[18px] py-2"
		>
			<h2 class="font-bold text-[#F6F6F6]">Leaderboard</h2>
			<div class="flex w-[110px] gap-1 rounded-[3px] px-1 py-1">
				{#each ['1D', '7D', '1M'] as const as tab}
					<button
						type="button"
						onclick={() => setActiveTab(tab)}
						class="px-2 text-xs {activeTab === tab
							? 'rounded-[10px] border-[2px] border-[#4F4888] bg-[linear-gradient(34deg,rgba(32,19,53,0.13)_14.13%,rgba(85,42,152,0.13)_47.4%,rgba(208,188,245,0.13)_73.78%)] !font-bold text-[#FFF] backdrop-blur-[2px]'
							: 'text-[#FFF]'}"
					>
						{tab}
					</button>
				{/each}
			</div>
		</div>

		<!-- Table Header -->
		<div
			class="mx-[18px] flex justify-between pt-[15px] pr-4 pb-1 text-sm font-semibold text-[#FFF]"
		>
			<span class="w-[45px]">Rank</span>
			<span class="flex-1 pl-9">Player</span>
			<span class="max-[1600px]:pr-2">Winnings</span>
		</div>

		<!-- Rows -->
		<div class="mr-[20px] max-h-[225px] overflow-y-auto px-[18px] text-xs">
			{#each entries as user, index}
				<div class="flex items-center py-[5px] text-xs">
					<span class="w-[40px] text-[#F6F6F6]">
						{#if getRankIcon(index + 1)}
							<span class="relative">
								<span class="absolute">
									<StartIcon fill={getRankIcon(index + 1)!.fill} />
								</span>
								<span class="pl-5">{index + 1}. </span>
							</span>
						{:else}
							<span class="pl-5 text-[#F6F6F6]">{index + 1}.</span>
						{/if}
					</span>
					<span class="flex flex-1 items-center gap-2 truncate pl-2 text-[#9782DF]">
						<div class="h-[22px] w-[22.633px] rounded-full bg-[#9782DF] object-cover"></div>
						{user.name}
					</span>
					<span class="text-[#F6F6F6]">{user.winnings.toFixed(2)} SOL</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Featured Section -->
	<div class="">
		<h3 class="bg-[#4F488880] px-[18px] py-[10px] font-bold text-[#F6F6F6]">Featured</h3>

		<div class="relative">
			<!-- Carousel Slides -->
			<div class="relative h-[180px] overflow-hidden">
				<div
					class="flex transition-transform duration-300 ease-in-out"
					style="transform: translateX(-{currentSlide * 100}%)"
				>
					{#each slides as _, index}
						<div class="h-[160px] min-w-full flex-shrink-0">
							<img
								src="https://quest-csv-images.s3.ca-central-1.amazonaws.com/dotpvp-dev/Images/background.png"
								alt="Slide {index + 1}"
								class="h-[160px] w-full object-cover"
							/>
						</div>
					{/each}
				</div>

				<!-- Carousel Indicators -->
				<div class="absolute right-0 bottom-0 left-0 flex items-center justify-center gap-1 pb-2">
					{#each slides as _, index}
						<button
							type="button"
							onclick={() => goToSlide(index)}
							class=" h-1.5 w-4 transition-colors {currentSlide === index
								? 'bg-[#F8EE02]'
								: 'bg-[#ffffff]'}"
							aria-label="Slide {index + 1}"
						></button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

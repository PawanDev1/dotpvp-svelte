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

<div class=" h-full w-full p-[0.29vw] pt-[0.47vw]">
	<div class="h-[18.53vw]">
		<!-- Header -->
		<div
			style="clip-path: polygon(2% 0, 100% 0, 100% 100%, 0 100%, 0 14%)"
			class="flex items-center justify-between bg-[#4F488880] px-[1.06vw] py-[0.47vw]"
		>
			<h2 class="font-bold text-[#F6F6F6]">Leaderboard</h2>
			<div class="flex w-[6.47vw] gap-[0.24vw] rounded-[0.18vw] px-[0.24vw] py-[0.24vw]">
				{#each ['1D', '7D', '1M'] as const as tab}
					<button
						type="button"
						onclick={() => setActiveTab(tab)}
						class="px-[0.47vw] text-[0.71vw] {activeTab === tab
							? 'rounded-[0.59vw] border-[0.12vw] border-[#4F4888] bg-[linear-gradient(34deg,rgba(32,19,53,0.13)_14.13%,rgba(85,42,152,0.13)_47.4%,rgba(208,188,245,0.13)_73.78%)] font-bold! text-[#FFF] backdrop-blur-[0.12vw]'
							: 'text-[#FFF]'}"
					>
						{tab}
					</button>
				{/each}
			</div>
		</div>

		<!-- Table Header -->
		<div
			class="mx-[1.06vw] flex justify-between pt-[0.88vw] pr-[0.94vw] pb-[0.24vw] text-[0.82vw] font-semibold text-[#FFF]"
		>
			<span class="w-[2.65vw]">Rank</span>
			<span class="flex-1 pl-[2.12vw]">Player</span>
			<span class="max-[1600px]:pr-[0.47vw]">Winnings</span>
		</div>

		<!-- Rows -->
		<div class="mr-[1.18vw] max-h-[13.24vw] overflow-y-auto px-[1.06vw] text-[0.71vw]">
			{#each entries as user, index}
				<div class="flex items-center py-[0.29vw] text-[0.71vw]">
					<span class="w-[2.35vw] text-[#F6F6F6]">
						{#if getRankIcon(index + 1)}
							<span class="relative">
								<span class="absolute">
									<StartIcon fill={getRankIcon(index + 1)!.fill} />
								</span>
								<span class="pl-[1.18vw]">{index + 1}. </span>
							</span>
						{:else}
							<span class="pl-[1.18vw] text-[#F6F6F6]">{index + 1}.</span>
						{/if}
					</span>
					<span class="flex flex-1 items-center gap-[0.47vw] truncate pl-[0.47vw] text-[#9782DF]">
						<div class="h-[1.29vw] w-[1.33vw] rounded-full bg-[#9782DF] object-cover"></div>
						{user.name}
					</span>
					<span class="text-[#F6F6F6]">{user.winnings.toFixed(2)} SOL</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Featured Section -->
	<div class="">
		<h3 class="bg-[#4F488880] px-[1.06vw] py-[0.59vw] font-bold text-[#F6F6F6]">Featured</h3>

		<div class="relative">
			<!-- Carousel Slides -->
			<div class="relative h-[13.59vw] overflow-hidden">
				<div
					class="flex transition-transform duration-300 ease-in-out"
					style="transform: translateX(-{currentSlide * 100}%)"
				>
					{#each slides as _, index}
						<div class="h-[11.91vw] min-w-full shrink-0">
							<img
								src="https://quest-csv-images.s3.ca-central-1.amazonaws.com/dotpvp-dev/Images/background.png"
								alt="Slide {index + 1}"
								class="h-[11.91vw] w-full object-cover"
							/>
						</div>
					{/each}
				</div>

				<!-- Carousel Indicators -->
				<div
					class="absolute right-0 bottom-0 left-0 flex items-center justify-center gap-[0.24vw] pb-[0.47vw]"
				>
					{#each slides as _, index}
						<button
							type="button"
							onclick={() => goToSlide(index)}
							class=" h-[0.49vw] w-[1.14vw] transition-colors {currentSlide === index
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

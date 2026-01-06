<script lang="ts">
	import StatCard from './StatCard.svelte';
	import { userStore, type User } from '$lib/stores/userStore';
	import ReferralsIcons from './icons/ReferralsIcons.svelte';
	import EarningIcons from './icons/EarningIcons.svelte';
	import InfoIcon from './icons/InfoIcon.svelte';
	import { onMount } from 'svelte';

	let user = $state<User | null>(null);
	let showTooltip = $state(false);
	let scale = $state(1);

	// Subscribe to user store
	$effect(() => {
		const unsubscribe = userStore.subscribe((value) => {
			user = value;
		});
		return unsubscribe;
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
</script>

<div class="px-[18px] pt-[18px]">
	<!-- Referral Cards -->
	<div class="grid grid-cols-1 gap-x-[18px] gap-y-[12px]">
		<StatCard
			className="h-[53px]! flex justify-between"
			label="Referral Link"
			value={user?.referralCode ?? '------'}
			isCopyable={true}
			longImg={true}
		/>
		<div class="grid grid-cols-2 gap-x-[18px]">
			<StatCard
				className="h-[53px]!"
				label="Total Referrals"
				value={user ? `${user.referrals}` : '0'}
				icon={ReferralsIcons}
			/>
			<StatCard
				className="h-[53px]! flex justify-between"
				label="Referral Earnings"
				value={user ? `${user.referralEarnings}` : '0'}
				icon={EarningIcons}
			/>
		</div>

		<div
			style="background: url(https://quest-csv-images.s3.ca-central-1.amazonaws.com/dotpvp-dev/stats-bg-min.png); background-size: 100% 100%; background-position: center; background-repeat: no-repeat;"
			class="relative flex h-[53px] items-center justify-between"
		>
			<div class="flex h-full w-full items-center justify-between gap-1 px-5">
				<h2 class="font-bruce-forever flex items-center gap-2 text-base text-[#ECE202] uppercase">
					Airdrop Multiplier
					<div
						class="relative cursor-pointer"
						role="button"
						tabindex="0"
						onmouseenter={() => (showTooltip = true)}
						onmouseleave={() => (showTooltip = false)}
					>
						<InfoIcon isWhite={true} large={true} />
						{#if showTooltip}
							{@const tooltipScale = scale + 0.4}
							<div
								class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1 max-w-[180px] -translate-x-1/2 px-3 py-1.5 text-[8px] text-white"
								style="background: url(https://quest-csv-images.s3.ca-central-1.amazonaws.com/dotpvp-dev/fe_assets/tooltip-bg.png); background-size: 100% 100%; background-position: center; background-repeat: no-repeat; transform: scale({tooltipScale}); transform-origin: bottom;"
							>
								Each multiplier boost = more tokens in your victory chest!
								<div
									class="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-t-4 border-r-4 border-l-4 border-transparent border-t-[#C2B7F3]"
								></div>
							</div>
						{/if}
					</div>
				</h2>
				<p class="font-bruce-forever text-center text-[26px] tracking-[1.8px] text-[#ECE202]">
					x{user ? user?.multiplier?.toFixed(2) : Number(1).toFixed(2)}
				</p>
			</div>
		</div>
	</div>
</div>

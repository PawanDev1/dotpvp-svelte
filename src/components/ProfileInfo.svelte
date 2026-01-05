<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	interface User {
		walletAddress?: string;
		rank?: number;
		name?: string;
	}

	interface Props {
		user?: User | null;
		isConnected?: boolean;
		isLoggedIn?: boolean;
		profileImage?: string;
		loading?: boolean;
		errors?: { name?: string };
	}

	let {
		user = null,
		isConnected = false,
		isLoggedIn = false,
		profileImage = '',
		loading = false,
		errors = {}
	}: Props = $props();

	let profileImageHovering = $state(false);
	let nameValue = $state('');

	$effect(() => {
		if (user?.name) {
			nameValue = user.name;
		}
	});

	const dispatch = createEventDispatcher();

	function shortenAddress(address: string): string {
		if (!address || address.length < 10) return address;
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	}

	function handleFileSelect() {
		dispatch('fileSelect');
	}

	function handleImageError(e: Event) {
		const target = e.currentTarget as HTMLImageElement;
		target.src =
			'https://quest-csv-images.s3.ca-central-1.amazonaws.com/dotpvp-dev/Images/default-avatar.png';
	}

	function handleNameInput(e: Event) {
		const target = e.target as HTMLInputElement;
		nameValue = target.value;
		dispatch('nameChange', { value: nameValue });
	}
</script>

<div class="h-full w-full relative">
	<img
		src="https://quest-csv-images.s3.ca-central-1.amazonaws.com/dotpvp-dev/ProfileSection-bg-min.png"
		alt="profile"
		class="w-full absolute top-0 left-0 h-full object-cover"
	/>
	<img
		src="https://quest-csv-images.s3.ca-central-1.amazonaws.com/dotpvp-dev/dotpvp-logo-min.png"
		alt="profile"
		class="w-[18vw] h-[5vw] absolute -top-[3.3vw] left-1/2 -translate-x-1/2"
	/>
	<div class="w-full grid grid-cols-2 items-center px-[1.25vw] mt-[2vw] gap-6 relative">
		<div class="flex w-full gap-[1vw] items-center">
			<div class="mt-[0.5vw] relative">
				<div
					role="button"
					tabindex="0"
					onmouseenter={() => (profileImageHovering = true)}
					onmouseleave={() => (profileImageHovering = false)}
					class="relative rounded-full w-[3.45vw] h-[3.45vw] p-px bg-[#FFD000]"
				>
					{#if user && isConnected && profileImageHovering}
						<div
							class="w-full rounded-full bg-black/45 h-full absolute top-0 left-0 bottom-0 right-0"
						></div>
					{/if}
					<img
						src={
							profileImage ||
							'https://quest-csv-images.s3.ca-central-1.amazonaws.com/dotpvp-dev/Images/default-avatar.png'
						}
						alt="Profile"
						onerror={handleImageError}
						class="w-[3.333vw] h-[3.333vw] object-cover rounded-full"
					/>
					{#if user && isConnected && profileImageHovering}
						<button
							type="button"
							onclick={handleFileSelect}
							class="absolute z-40 cursor-pointer top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-transparent border-none p-0"
							aria-label="Edit profile image"
						>
							<svg
								width="34"
								height="34"
								viewBox="0 0 34 34"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
							<g filter="url(#filter0_d_3157_16941)">
								<path
									d="M8.99278 20.8952C8.91196 20.9764 8.8566 21.0794 8.8335 21.1916L8.01132 25.304C7.97299 25.4946 8.03345 25.6911 8.17061 25.8295C8.22473 25.8835 8.28896 25.9263 8.35962 25.9554C8.43028 25.9845 8.50598 25.9994 8.5824 25.9993C8.61947 25.9993 8.65801 25.9959 8.69634 25.9878L12.8074 25.1656C12.9214 25.1422 13.0248 25.0877 13.1051 25.0061L22.3065 15.8047L18.1954 11.6938L8.99278 20.8952ZM25.1487 8.85046C24.0149 7.71651 22.1704 7.71651 21.0376 8.85046L19.4281 10.4599L23.5392 14.571L25.1487 12.9613C25.6976 12.4136 26 11.6832 26 10.9064C26 10.1296 25.6976 9.39919 25.1487 8.85046Z"
									fill="#FFD000"
								/>
							</g>
							<defs>
								<filter
									id="filter0_d_3157_16941"
									x="0"
									y="0"
									width="34"
									height="33.999"
									filterUnits="userSpaceOnUse"
									color-interpolation-filters="sRGB"
								>
									<feFlood flood-opacity="0" result="BackgroundImageFix" />
									<feColorMatrix
										in="SourceAlpha"
										type="matrix"
										values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
										result="hardAlpha"
									/>
									<feOffset />
									<feGaussianBlur stdDeviation="4" />
									<feComposite in2="hardAlpha" operator="out" />
									<feColorMatrix
										type="matrix"
										values="0 0 0 0 1 0 0 0 0 0.815686 0 0 0 0 0 0 0 0 0.25 0"
									/>
									<feBlend
										mode="normal"
										in2="BackgroundImageFix"
										result="effect1_dropShadow_3157_16941"
									/>
									<feBlend
										mode="normal"
										in="SourceGraphic"
										in2="effect1_dropShadow_3157_16941"
										result="shape"
									/>
								</filter>
							</defs>
						</svg>
						</button>
					{/if}
				</div>
			</div>
			<div class="w-full">
				<p class="text-[0.938vw] font-semibold text-[#ECE202]">Player Name</p>
				<div
					class="max-w-[207px] placeholder:text-[#878787] bg-[#161616] border border-[#FDC700] relative w-full gap-[0.625vw] flex items-center justify-between pl-[0.625vw] h-[1.823vw] mt-[0.313vw] {errors.name
						? 'border border-red-500 bg-red-100/10'
						: 'border-2 border-[#4F4888]'}"
				>
					<div class="flex flex-col w-full relative">
						<input
							type="text"
							value={nameValue}
							oninput={handleNameInput}
							class="text-[#C0C0C0] placeholder:text-[#C0C0C0] outline-none text-[0.625vw] font-medium bg-transparent w-full pr-[1.25vw]"
							placeholder="Enter username"
							title="Username must be 3–10 characters long, and can only contain letters, numbers, - or _"
							disabled={!isLoggedIn}
						/>
						{#if loading}
							<span class="absolute right-2 top-1/2 -translate-y-1/2">
								<svg
									class="animate-spin"
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<circle
										cx="8"
										cy="8"
										r="7"
										stroke="#ECE202"
										stroke-width="2"
										opacity="0.2"
									/>
									<path
										d="M15 8A7 7 0 1 1 8 1"
										stroke="#ECE202"
										stroke-width="2"
										stroke-linecap="round"
									/>
								</svg>
							</span>
						{/if}
					</div>
				</div>
			</div>
		</div>
		<div class="flex w-full justify-between gap-4">
			<div>
				<p class="text-[0.938vw] text-[#ECE202] font-semibold">Wallet Address</p>
				<p class="text-[0.729vw] mt-[0.208vw] font-bold">
					{user && isConnected && user?.walletAddress
						? shortenAddress(user.walletAddress)
						: '-'}
				</p>
			</div>
			<div>
				<p class="text-[0.938vw] text-[#ECE202] font-semibold">Global Rank</p>
				<p class="text-[0.729vw] mt-[0.208vw] font-bold">
					{user && isConnected && user?.rank ? `#${user.rank}` : '-'}
				</p>
			</div>
		</div>
	</div>
</div>
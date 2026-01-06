<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import solIcon from '$lib/assets/sol.svg';
	import playNowBg from '$lib/assets/playnow-bg.svg';

	interface User {
		walletAddress?: string;
		rank?: number;
		name?: string;
	}

	interface LobbyTab {
		name: string;
		value: number;
	}

	interface Lobby {
		id: string;
		name: string;
		lobbyCode?: string;
		lobbyId?: string;
		players: string | number;
		fee: string;
		pool: string | number;
		isActive?: boolean;
		maxPlayers?: number;
		brStatus?: 'waiting_room' | 'countdown' | 'active' | 'ended';
		brWaitingPlayers?: number;
		brActivePlayers?: number;
		brRequiredPlayers?: number;
		battleRoyaleConfig?: {
			requiredPlayers?: number;
		};
	}

	interface Props {
		user?: User | null;
		isConnected?: boolean;
		isLoggedIn?: boolean;
		profileImage?: string;
		loading?: boolean;
		errors?: { name?: string };
		lobbiesLoading?: boolean;
	}

	const LOBBY_TABS: LobbyTab[] = [
		{ name: 'Global Lobby', value: 1 },
		{ name: 'Private Lobby', value: 2 }
	];

	const colors = [
		'#FFD000',
		'#FF6B6B',
		'#4ECDC4',
		'#45B7D1',
		'#FFA07A',
		'#98D8C8',
		'#F7DC6F',
		'#BB8FCE'
	];

	// Dummy lobbies data
	const dummyLobbies: Lobby[] = [
		{
			id: '1',
			name: 'Lobby Alpha',
			players: '8/10',
			fee: '0.1 SOL',
			pool: 1.5,
			isActive: true,
			maxPlayers: 10
		},
		{
			id: '2',
			name: 'Lobby Beta',
			lobbyCode: 'PRIVATE123',
			players: '5/8',
			fee: '0.2 SOL',
			pool: 2.3,
			isActive: true,
			maxPlayers: 8
		},
		{
			id: '3',
			name: 'Lobby Gamma',
			players: '10/10',
			fee: '0.15 SOL',
			pool: 3.0,
			isActive: true,
			maxPlayers: 10
		},
		{
			id: '4',
			name: 'Lobby Delta',
			players: '3/6',
			fee: '0.05 SOL',
			pool: 0.8,
			isActive: false,
			maxPlayers: 6
		},
		{
			id: '5',
			name: 'Lobby Epsilon',
			lobbyCode: 'PRIVATE456',
			players: '2/4',
			fee: '0.3 SOL',
			pool: 1.2,
			isActive: true,
			maxPlayers: 4
		},
	];

	let {
		user = null,
		isConnected = false,
		isLoggedIn = false,
		profileImage = '',
		loading = false,
		errors = {},
		lobbiesLoading = false
	}: Props = $props();

	let profileImageHovering = $state(false);
	let nameValue = $state('');
	let selectedLobbyTab = $state(1);
	let selectedLobby = $state<Lobby | null>(null);
	let servers = $state<Lobby[]>(dummyLobbies);

	function getFilteredLobbies(): Lobby[] {
		return servers.filter((lobby) => {
			if (selectedLobbyTab === 1) {
				return !lobby.lobbyCode;
			} else {
				return !!lobby.lobbyCode;
			}
		});
	}

	$effect(() => {
		if (user?.name) {
			nameValue = user.name;
		}
	});

	// Set first lobby as selected by default when tab or servers change
	$effect(() => {
		const filteredLobbies = getFilteredLobbies();
		if (filteredLobbies.length > 0) {
			const firstLobby = filteredLobbies[0];
			// Only update if no lobby is selected or the selected lobby is not in the current filtered list
			if (
				!selectedLobby ||
				!filteredLobbies.some((l) => l.id === selectedLobby?.id)
			) {
				selectedLobby = { ...getDisplayData(firstLobby), id: firstLobby.id };
			}
		} else {
			selectedLobby = null;
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

	function getDisplayData(lobby: Lobby): Lobby {
		return lobby;
	}

	function isLobbyFull(displayData: Lobby): boolean {
		if (typeof displayData.players === 'string') {
			const match = displayData.players.match(/(\d+)\/(\d+)/);
			if (match) {
				const current = parseInt(match[1]);
				const max = parseInt(match[2]);
				return current >= max;
			}
		}
		return false;
	}

	function handleLobbyClick(lobby: Lobby) {
		const displayData = getDisplayData(lobby);
		const isFull = isLobbyFull(displayData);
		const isOffline = !displayData.isActive;

		if (isFull) {
			dispatch('toast', {
				type: 'error',
				title: 'Lobby Full',
				message: 'This lobby is currently at maximum capacity'
			});
			return;
		}

		if (isOffline) {
			dispatch('toast', {
				type: 'error',
				title: 'Lobby Offline',
				message: 'This lobby is currently offline'
			});
			return;
		}

		// Ensure only one lobby is selected at a time
		selectedLobby = { ...displayData, id: lobby.id };
		dispatch('lobbySelect', { lobby: displayData });
	}

	function formatPoolValue(pool: string | number): string {
		const poolValueRaw = parseFloat(pool.toString());
		const poolValue = isNaN(poolValueRaw) ? 0 : Math.max(0, poolValueRaw);
		return (Math.floor(poolValue * 1000) / 1000).toFixed(3);
	}
</script>

<div class="h-full flex flex-col justify-between w-full relative">
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
	<div>
		<div class="w-full grid grid-cols-2 items-center px-[1.25vw] mt-[2vw] gap-[1.25vw] relative">
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
							? ' border-red-500 bg-red-100/10'
							: ' border-[#4F4888]'}"
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
	
		<!-- lobbies -->
		<div class="h-[7.5vw] relative px-[1.25vw] mt-[0.7vw]">
			<div class="grid grid-cols-2 h-[1.25vw]">
				{#each LOBBY_TABS as tab}
					<button
						type="button"
						onclick={() => (selectedLobbyTab = tab.value)}
						class="flex items-center justify-center gap-1 cursor-pointer {selectedLobbyTab === tab.value
							? 'bg-[#33203A]'
							: 'bg-[#635D76] text-[#A19AB9]'}"
					>
						<p class="text-[0.729vw] font-medium">{tab.name}</p>
					</button>
				{/each}
			</div>
	
			<div
				class="grid grid-cols-12 gap-[0.4vw] w-[96%] mt-[0.325vw] px-[2vw] whitespace-pre -my-[0.2vw] pb-[0.4vw] border-b border-[#FFEF00]"
			>
				<p class="text-[0.729vw] -ml-[1.5vw] text-start col-span-4 font-bold">Lobby</p>
				<p class="text-[0.729vw] -ml-[1.5vw] text-start col-span-2 font-bold">Gamemode</p>
				<p class="text-[0.729vw] text-start col-span-2 font-bold">Players</p>
				<p class="text-[0.729vw] text-start col-span-2 font-bold">Buy In</p>
				<p class="text-[0.729vw] text-start col-span-2 font-bold">Prize Pool</p>
			</div>
			<div class="flex flex-col pr-[1.25vw] h-full mt-[0.417vw] max-h-[5.833vw] overflow-y-auto">
				{#if lobbiesLoading}
					<div class="space-y-[0.625vw] mt-[0.4vw] w-[96%] animate-pulse">
						{#each Array(4) as _, idx}
							<div class="flex gap-3 items-center">
								<div class="w-full h-[0.625vw] bg-[#1b172b] rounded"></div>
								<div class="w-full h-[0.625vw] bg-[#1b172b] rounded"></div>
								<div class="w-full h-[0.625vw] bg-[#1b172b] rounded"></div>
								<div class="w-full h-[0.625vw] bg-[#1b172b] rounded"></div>
								<div class="w-full h-[0.625vw] bg-[#1b172b] rounded"></div>
							</div>
						{/each}
					</div>
				{:else}
					{#each getFilteredLobbies() as lobby, index}
						{@const displayData = getDisplayData(lobby)}
						{@const isFull = isLobbyFull(displayData)}
						{@const isOffline = !displayData.isActive}
						{@const isBRLobby =
							displayData.brStatus ||
							displayData.brWaitingPlayers ||
							displayData.brActivePlayers}
						{@const hasBRStatus =
							displayData.brStatus &&
							(displayData.brStatus === 'countdown' ||
								displayData.brStatus === 'active')}
						{@const shouldShowAsOffline = isOffline && !(isBRLobby && hasBRStatus)}
						<button
							type="button"
							onclick={() => handleLobbyClick(lobby)}
							style={
								lobby.id === selectedLobby?.id
									? 'border: 0.1vw solid #4F4888; background: linear-gradient(34deg, rgba(32, 19, 53, 0.13) 14.13%, rgba(85, 42, 152, 0.13) 47.4%, rgba(208, 188, 245, 0.13) 73.78%); backdrop-filter: blur(2px);'
									: 'padding: 0.7vw 0.05vw 0.7vw 0.45vw;'
							}
							class="flex h-[1.042vw] pl-[0.5vw] py-[0.7vw] justify-center shrink-0 self-stretch gap-[0.625vw] items-center {isFull ||
							shouldShowAsOffline
								? 'opacity-50 cursor-not-allowed'
								: 'cursor-pointer'}"
						>
							<div class="grid grid-cols-12 gap-[0.417vw] whitespace-pre w-full">
								<div class="flex items-center col-span-3 gap-[0.417vw]">
									<p
										class="text-[0.625vw] font-medium"
										style="color: {colors[index % colors.length]}"
									>
										{displayData.name}
									</p>
								</div>
								<p class="text-[0.625vw] ml-[1.5vw] font-medium col-span-2">Free for all</p>
								<div
									class="text-[0.625vw] font-medium ml-[1.3vw] col-span-2 {isFull
										? 'text-red-400'
										: shouldShowAsOffline
											? 'text-gray-400'
											: ''}"
								>
									{#if shouldShowAsOffline}
										<!-- Empty -->
									{:else if isFull}
										FULL
									{:else if isBRLobby}
										<span class="text-[0.625vw] text-gray-400">
											{#if displayData.brStatus === 'waiting_room'}
												<span class="text-purple-300">
													IN-Q ({displayData.brWaitingPlayers || 0}/
													{displayData.brRequiredPlayers ||
														displayData.battleRoyaleConfig?.requiredPlayers ||
														2}
													)
												</span>
											{:else if displayData.brStatus === 'countdown'}
												<span class="text-orange-300">
													IN-G ({displayData.brWaitingPlayers || 0})
												</span>
											{:else if displayData.brStatus === 'active'}
												<span class="text-green-300">
													IN-G ({displayData.brActivePlayers || 0})
												</span>
											{:else if displayData.brStatus === 'ended'}
												<span class="text-gray-400">Ended</span>
											{:else}
												<span class="text-gray-400">
													{displayData.players}
												</span>
											{/if}
										</span>
									{:else}
										{displayData.players}
									{/if}
								</div>
								<p class="text-[0.625vw] text-start font-medium ml-[1.7vw] col-span-2">{displayData.fee}</p>
								<p
									class="text-[0.625vw] col-span-2 text-[#FFEF00] ml-[1.2vw] font-semibold flex items-center gap-[0.2vw]"
								>
									<!-- Sol Icon -->
									<img src={solIcon} alt="sol" class="w-[0.9vw] h-[0.9vw]" />
									{formatPoolValue(displayData.pool)}
								</p>
							</div>
						</button>
					{/each}
				{/if}
			</div>
		</div>
	</div>
	<button class="bg-contain w-[92%] mb-1 cursor-pointer mx-auto bg-center relative bg-no-repeat h-[2.5vw] mt-[0.7vw] group">
		<p class="text-[0.67vw] mt-auto relative z-10 font-medium group-hover:[text-shadow:0_0_5px_rgba(255,255,255,0.8),0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300">CONNECT & PLAY</p>
		<img src={playNowBg} alt="play now" class="w-full h-full absolute top-0 left-0" />
	</button>
</div>
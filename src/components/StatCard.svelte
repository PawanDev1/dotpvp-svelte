<script lang="ts">
	import CopyIcon from './icons/CopyIcon.svelte';
	import CopyMsgIcon from './icons/CopyMsgIcon.svelte';
	import referralsSmallImg from '$lib/assets/images/referrrals-small-img.png';

	interface Props {
		label: string;
		value: string | number;
		longImg?: boolean;
		className?: string;
		isCopyable?: boolean;
		icon?: any; // Svelte component constructor or snippet
	}

	let { label, value, longImg = false, className = '', isCopyable = false, icon }: Props = $props();

	let showValueTooltip = $state(false);
	let showIconTooltip = $state(false);

	function handleCopyFromValue() {
		navigator.clipboard.writeText(value.toString());
		showValueTooltip = true;

		setTimeout(() => {
			showValueTooltip = false;
		}, 2500);
	}

	function handleCopyFromIcon() {
		navigator.clipboard.writeText(value.toString());
		showIconTooltip = true;

		setTimeout(() => {
			showIconTooltip = false;
		}, 2500);
	}

	function handleKeyDown(event: KeyboardEvent, handler: () => void) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handler();
		}
	}
</script>

<div
	style="background: {longImg
		? 'url(https://quest-csv-images.s3.ca-central-1.amazonaws.com/dotpvp-dev/stats-bg-min.png)'
		: `url(${referralsSmallImg})`}; background-size: 100% 100%; background-position: center; background-repeat: no-repeat;"
	class="relative h-[3.59vw] w-full bg-[#878787] p-[0.06vw] {className}"
>
	<div class="flex h-full w-full items-center justify-between gap-[0.24vw] px-[1.18vw] py-[0.47vw]">
		<div class="relative flex flex-col justify-center">
			<span class="text-[0.82vw] font-bold text-[#FFF]">{label}</span>
			{#if isCopyable}
				<button
					type="button"
					class="cursor-pointer text-left font-bold text-[#FFEF00]"
					onclick={handleCopyFromValue}
					onkeydown={(e) => handleKeyDown(e, handleCopyFromValue)}
				>
					{value}
				</button>
			{:else}
				<span class="font-bold text-[#FFEF00]">{value}</span>
			{/if}
			<!-- Tooltip above the value -->
			{#if showValueTooltip}
				<div
					style="background: url(/images/copy-bg-icon.png); background-size: 100% 100%; background-position: center; background-repeat: no-repeat;"
					class="absolute top-[0.24vw] bottom-full left-0 z-10 mb-[0.47vw] flex h-[1.41vw] w-[5.24vw] items-center justify-center gap-[0.24vw] text-[0.71vw] font-medium whitespace-nowrap text-white"
				>
					<CopyMsgIcon />
					<span class="text-[0.59vw] font-medium text-white"> Link Copied! </span>
				</div>
			{/if}
		</div>
		{#if isCopyable}
			<div class="relative">
				<button
					type="button"
					onclick={handleCopyFromIcon}
					onkeydown={(e) => handleKeyDown(e, handleCopyFromIcon)}
					class="cursor-pointer"
					aria-label="Copy to clipboard"
				>
					<CopyIcon />
				</button>
				<!-- Tooltip above the icon -->
				{#if showIconTooltip}
					<div
						style="background: url(/images/copy-bg-icon.png); background-size: 100% 100%; background-position: center; background-repeat: no-repeat;"
						class="absolute -right-[1.18vw] bottom-full z-10 mb-[0.47vw] flex h-[1.41vw] w-[5.24vw] items-center justify-center gap-[0.24vw] text-[0.71vw] font-medium whitespace-nowrap text-white"
					>
						<CopyMsgIcon />
						<span class="text-[0.59vw] font-medium text-white"> Link Copied! </span>
					</div>
				{/if}
			</div>
		{/if}
	</div>
	{#if icon}
		<div class="absolute top-1/2 right-0 -translate-y-1/2">
			{#if typeof icon === 'function'}
				{@const IconComponent = icon}
				<IconComponent />
			{:else}
				{icon}
			{/if}
		</div>
	{/if}
</div>

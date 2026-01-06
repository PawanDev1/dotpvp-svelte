<script lang="ts">
	interface Props {
		imageSrc?: string;
		message?: string;
		isConnected?: boolean;
		setIsConnected?: (value: boolean) => void;
	}

	let {
		imageSrc = "",
		message = "No data available",
		isConnected = true,
		setIsConnected
	}: Props = $props();
</script>

<div class="flex h-[230px] flex-col items-center justify-center gap-4 px-4">
	{#if imageSrc}
		<img src={imageSrc} alt="No data" class="h-24 w-24 opacity-50" />
	{/if}
	<p class="text-sm text-[#F6F6F6]">{message}</p>
</div>


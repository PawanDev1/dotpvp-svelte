<script lang="ts">
	interface Props {
		onPlayNow?: () => void;
	}

	let { onPlayNow }: Props = $props();
	
	// Placeholder component - replace with actual PlayerStatsInfo implementation
</script>

<div class="p-4">
	<p class="text-white">Player Stats Info Component</p>
	{#if onPlayNow}
		<button
			onclick={onPlayNow}
			class="mt-2 px-4 py-2 bg-yellow-400 text-black rounded"
		>
			Play Now
		</button>
	{/if}
	<!-- Add your player stats content here -->
</div>


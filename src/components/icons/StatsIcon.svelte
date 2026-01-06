<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = "" }: Props = $props();
</script>

<svg
	class={className}
	width="16"
	height="16"
	viewBox="0 0 16 16"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<!-- Placeholder icon - replace with actual StatsIcon SVG -->
	<path
		d="M2 14V10H4V14H2ZM6 14V6H8V14H6ZM10 14V8H12V14H10ZM14 14V2H16V14H14Z"
		fill="currentColor"
	/>
</svg>


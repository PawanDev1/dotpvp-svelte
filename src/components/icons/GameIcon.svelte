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
	<!-- Placeholder icon - replace with actual GameIcon SVG -->
	<rect x="2" y="2" width="12" height="12" rx="2" fill="currentColor" />
</svg>

